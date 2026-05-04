import logging
import re

import fitz  # PyMuPDF
import tiktoken
from docx import Document as DocxDocument
from google import genai
from google.genai import types

from app.core.config import settings

logger = logging.getLogger(__name__)

OCR_PROMPT = (
    "Extract readable text. "
    "Preserve headings. "
    "Preserve tables in markdown. "
    "Return clean structured text only."
)


def clean_text(text: str) -> str:
    text = text.replace("\x00", "")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def perform_gemini_ocr(image_bytes: bytes) -> str:
    if not settings.GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY missing, skipping OCR fallback.")
        return ""

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-2.5-pro",
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
                OCR_PROMPT,
            ],
        )
        return response.text if response.text else ""
    except Exception as e:
        logger.error(f"Gemini OCR failed: {e}")
        return ""


def extract_text_from_pdf(file_path: str, threshold: int = 50) -> str:
    text = ""
    with fitz.open(file_path) as doc:
        for page_num, page in enumerate(doc):
            text += f"\n[PAGE_BREAK:{page_num+1}]\n"
            page_text = page.get_text().strip()

            # Fallback to multimodal OCR if extracted text is below threshold
            if len(page_text) < threshold:
                logger.info(
                    f"Page {page_num+1} text length ({len(page_text)}) below threshold. "
                    "Triggering Gemini OCR fallback."
                )
                # Render page at 2x resolution (approx 144 DPI) for clear OCR
                mat = fitz.Matrix(2, 2)
                pix = page.get_pixmap(matrix=mat)
                image_bytes = pix.tobytes("png")

                ocr_text = perform_gemini_ocr(image_bytes)
                if ocr_text:
                    page_text = ocr_text

            text += page_text + "\n\n"
    return text


def extract_text_from_docx(file_path: str) -> str:
    doc = DocxDocument(file_path)
    return "\n\n".join([p.text for p in doc.paragraphs])


def extract_text_from_txt(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()


def parse_document(file_path: str, mime_type: str) -> str:
    if mime_type == "application/pdf":
        raw_text = extract_text_from_pdf(file_path)
    elif (
        mime_type
        == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ):
        raw_text = extract_text_from_docx(file_path)
    elif mime_type == "text/plain":
        raw_text = extract_text_from_txt(file_path)
    else:
        raise ValueError(f"Unsupported mime type: {mime_type}")

    return clean_text(raw_text)


def chunk_text(text: str, chunk_size: int = 800, overlap: int = 120) -> list[dict]:
    """
    Tokenizer-aware chunking with metadata extraction.
    Splits text accurately by tokens instead of words.
    """
    enc = tiktoken.get_encoding("cl100k_base")
    tokens = enc.encode(text)
    chunks = []

    current_section = "General"
    current_page = 1

    for i in range(0, max(1, len(tokens)), max(1, chunk_size - overlap)):
        chunk_tokens = tokens[i : i + chunk_size]
        chunk_text = enc.decode(chunk_tokens)

        # Track pages embedded by the parser
        page_match = re.findall(r"\[PAGE_BREAK:(\d+)\]", chunk_text)
        if page_match:
            current_page = int(page_match[-1])
            chunk_text = re.sub(r"\[PAGE_BREAK:\d+\]", "", chunk_text).strip()

        # Try to extract a section header if present (Markdown-style or all-caps)
        header_match = re.search(
            r"^(#{1,3}\s+.*|[A-Z\s]{5,})$", chunk_text, re.MULTILINE
        )
        if header_match:
            current_section = header_match.group(1).strip()[:100]

        chunks.append(
            {
                "content": chunk_text.strip(),
                "section": current_section,
                "page_number": current_page,
                "token_count": len(chunk_tokens),
            }
        )

    return chunks
