from typing import AsyncGenerator, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.ai.chat import generate_rag_answer, generate_rag_answer_stream
from app.ai.retrieval import retrieve_relevant_chunks
from app.api import deps
from app.db.session import AsyncSessionLocal
from app.models.chat import ChatMessage, ChatSession, RoleType
from app.models.user import User
from app.schemas.chat import (
    ChatAskRequest,
    ChatAskResponse,
    ChatMessageResponse,
    ChatSessionResponse,
    SourceDetail,
)

router = APIRouter()


@router.post("/ask", response_model=ChatAskResponse)
async def ask_question(
    request: ChatAskRequest,
    current_user: User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(deps.get_db),
):
    # 1. Handle Session
    if request.session_id:
        result = await db.execute(
            select(ChatSession).filter(
                ChatSession.id == request.session_id,
                ChatSession.user_id == current_user.id,
            )
        )
        session = result.scalars().first()
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
    else:
        # Create a new session
        title = (
            request.question[:50] + "..."
            if len(request.question) > 50
            else request.question
        )
        session = ChatSession(user_id=current_user.id, title=title)
        db.add(session)
        await db.commit()
        await db.refresh(session)

    # 2. Save user message
    user_msg = ChatMessage(
        session_id=session.id, role=RoleType.user, content=request.question
    )
    db.add(user_msg)

    # 3. Hybrid Retrieval via Neo4j graph traversal
    top_chunks = await retrieve_relevant_chunks(
        user_id=str(current_user.id),
        question=request.question,
    )

    sources = [
        SourceDetail(
            document_id=UUID(str(chunk.document_id)),
            filename=chunk.filename,
            page_number=chunk.page_number,
            content_snippet=chunk.content[:200],
        )
        for chunk in top_chunks
    ]

    # 4. Generate Answer via configured LLM provider (Bedrock / Gemini)
    rag_res = generate_rag_answer(request.question, top_chunks)
    answer_text = rag_res["text"]
    citations = [
        {"source_index": i + 1, "document_id": str(s.document_id)}
        for i, s in enumerate(sources)
    ]

    # 5. Save assistant message
    assistant_msg = ChatMessage(
        session_id=session.id,
        role=RoleType.assistant,
        content=answer_text,
        citations=citations,
        token_usage=rag_res.get("usage"),
        model_used=rag_res.get("model"),
    )
    db.add(assistant_msg)
    await db.commit()

    return ChatAskResponse(
        session_id=session.id,
        answer=answer_text,
        citations=citations,
        sources=sources,
        confidence_score=0.95 if top_chunks else 0.0,
    )


@router.post("/ask/stream")
async def ask_question_stream(
    request: ChatAskRequest,
    current_user: User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(deps.get_db),
):
    if request.session_id:
        result = await db.execute(
            select(ChatSession).filter(
                ChatSession.id == request.session_id,
                ChatSession.user_id == current_user.id,
            )
        )
        session = result.scalars().first()
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
    else:
        title = (
            request.question[:50] + "..."
            if len(request.question) > 50
            else request.question
        )
        session = ChatSession(user_id=current_user.id, title=title)
        db.add(session)
        await db.commit()
        await db.refresh(session)

    user_msg = ChatMessage(
        session_id=session.id, role=RoleType.user, content=request.question
    )
    db.add(user_msg)
    await db.commit()

    top_chunks = await retrieve_relevant_chunks(
        user_id=str(current_user.id),
        question=request.question,
    )

    sources = [
        SourceDetail(
            document_id=UUID(chunk.document_id),
            filename=chunk.filename,
            page_number=chunk.page_number,
            content_snippet=chunk.content[:200],
        )
        for chunk in top_chunks
    ]
    citations = [
        {"source_index": i + 1, "document_id": str(s.document_id)}
        for i, s in enumerate(sources)
    ]

    async def event_generator() -> AsyncGenerator[str, None]:
        full_text = ""
        async for chunk_text in generate_rag_answer_stream(
            request.question, top_chunks
        ):
            full_text += chunk_text
            yield chunk_text

        # Save assistant message on completion via a new session context
        async with AsyncSessionLocal() as session_db:
            assistant_msg = ChatMessage(
                session_id=session.id,
                role=RoleType.assistant,
                content=full_text,
                citations=citations,
                model_used="gemini-2.5-pro",
            )
            session_db.add(assistant_msg)
            await session_db.commit()

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.get("/sessions", response_model=List[ChatSessionResponse])
async def list_sessions(
    current_user: User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(deps.get_db),
):
    result = await db.execute(
        select(ChatSession)
        .filter(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.created_at.desc())
    )
    return result.scalars().all()


@router.get("/sessions/{id}/messages", response_model=List[ChatMessageResponse])
async def get_messages(
    id: UUID,
    current_user: User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(deps.get_db),
):
    # Verify session ownership
    result = await db.execute(
        select(ChatSession).filter(
            ChatSession.id == id, ChatSession.user_id == current_user.id
        )
    )
    if not result.scalars().first():
        raise HTTPException(status_code=404, detail="Session not found")

    messages_result = await db.execute(
        select(ChatMessage)
        .filter(ChatMessage.session_id == id)
        .order_by(ChatMessage.created_at.asc())
    )
    return messages_result.scalars().all()
