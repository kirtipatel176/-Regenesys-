"""
LLM Provider abstraction layer.

This module defines the ``LLMProvider`` interface and provides concrete
implementations for:

  • **Gemini**  — Google's Gemini 2.5 Pro (``gemini`` provider)
  • **Bedrock** — AWS Bedrock with Anthropic Claude 3.5 Sonnet (``bedrock`` provider)

The active provider is selected at runtime via the ``LLM_PROVIDER`` env
variable (see ``app.core.config.Settings``).  The factory function
``get_llm_provider()`` returns a singleton of the configured provider.

Adding a new provider
---------------------
1. Create a new class that inherits from ``LLMProvider``.
2. Implement ``generate()`` and ``generate_stream()``.
3. Register it in ``_PROVIDER_REGISTRY``.
4. Set ``LLM_PROVIDER=<key>`` in ``.env``.
"""

import logging
from abc import ABC, abstractmethod
from typing import Any, AsyncGenerator, Dict, Optional

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Abstract interface
# ---------------------------------------------------------------------------


class LLMProvider(ABC):
    """Base class that every LLM provider must implement."""

    @abstractmethod
    def generate(self, prompt: str) -> Dict[str, Any]:
        """
        Synchronous text generation.

        Returns
        -------
        dict with keys:
            - ``text``  (str)  — the generated answer
            - ``usage`` (dict | None) — token usage info
            - ``model`` (str)  — model identifier used
        """
        ...

    @abstractmethod
    async def generate_stream(self, prompt: str) -> AsyncGenerator[str, None]:
        """
        Async streaming text generation.

        Yields str chunks as they arrive from the model.
        """
        ...

    @property
    @abstractmethod
    def model_name(self) -> str:
        """Human-readable identifier for the model being used."""
        ...


# ---------------------------------------------------------------------------
# Gemini provider
# ---------------------------------------------------------------------------


class GeminiProvider(LLMProvider):
    """Google Gemini via the ``google-genai`` SDK."""

    def __init__(self):
        from google import genai

        from app.core.config import settings

        if not settings.GEMINI_API_KEY:
            raise RuntimeError(
                "LLM_PROVIDER is set to 'gemini' but GEMINI_API_KEY is empty."
            )
        self._client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self._model = settings.LLM_MODEL or "gemini-2.5-pro"
        logger.info("GeminiProvider initialised (model=%s)", self._model)

    @property
    def model_name(self) -> str:
        return self._model

    def generate(self, prompt: str) -> Dict[str, Any]:
        from google.genai import types

        response = self._client.models.generate_content(
            model=self._model,
            contents=prompt,
            config=types.GenerateContentConfig(temperature=0.0),
        )
        usage = None
        if hasattr(response, "usage_metadata") and response.usage_metadata:
            usage = {
                "prompt_tokens": response.usage_metadata.prompt_token_count,
                "candidates_tokens": response.usage_metadata.candidates_token_count,
            }
        return {"text": response.text, "usage": usage, "model": self._model}

    async def generate_stream(self, prompt: str) -> AsyncGenerator[str, None]:
        from google.genai import types

        response = await self._client.aio.models.generate_content_stream(
            model=self._model,
            contents=prompt,
            config=types.GenerateContentConfig(temperature=0.0),
        )
        async for chunk in response:
            if chunk.text:
                yield chunk.text


# ---------------------------------------------------------------------------
# AWS Bedrock provider  (Anthropic Claude via Bedrock)
# ---------------------------------------------------------------------------


class BedrockProvider(LLMProvider):
    """
    AWS Bedrock with Anthropic Claude models.

    Uses ``boto3`` with the Bedrock Runtime ``converse`` and
    ``converse_stream`` APIs, which provide a unified interface across
    all Bedrock foundation models.

    Required env vars:
        AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
        (or an attached IAM role / instance profile in production)
    """

    def __init__(self):
        import boto3

        from app.core.config import settings

        self._model = settings.LLM_MODEL or "anthropic.claude-3-5-sonnet-20241022-v2:0"
        self._max_tokens = settings.BEDROCK_MAX_TOKENS
        self._api_key = settings.BEDROCK_API_KEY
        self._region = settings.AWS_REGION or "us-east-1"

        if self._api_key:
            self._client = None
            logger.info(
                "BedrockProvider initialised with API Key (model=%s, region=%s)",
                self._model,
                self._region,
            )
        else:
            session_kwargs: Dict[str, Any] = {}
            if settings.AWS_ACCESS_KEY_ID:
                session_kwargs["aws_access_key_id"] = settings.AWS_ACCESS_KEY_ID
            if settings.AWS_SECRET_ACCESS_KEY:
                session_kwargs["aws_secret_access_key"] = settings.AWS_SECRET_ACCESS_KEY
            if settings.AWS_REGION:
                session_kwargs["region_name"] = settings.AWS_REGION

            session = boto3.Session(**session_kwargs)
            self._client = session.client("bedrock-runtime")
            logger.info(
                "BedrockProvider initialised with SigV4 (model=%s, region=%s)",
                self._model,
                self._region,
            )

    @property
    def model_name(self) -> str:
        return self._model

    def generate(self, prompt: str) -> Dict[str, Any]:
        if self._api_key:
            import httpx

            url = f"https://bedrock-runtime.{self._region}.amazonaws.com/model/{self._model}/converse"
            headers = {
                "Authorization": f"Bearer {self._api_key}",
                "Content-Type": "application/json",
            }
            payload = {
                "messages": [{"role": "user", "content": [{"text": prompt}]}],
                "inferenceConfig": {"maxTokens": self._max_tokens, "temperature": 0.0},
            }
            response = httpx.post(url, headers=headers, json=payload, timeout=60.0)
            response.raise_for_status()
            data = response.json()

            # Extract text from the response
            output_message = data.get("output", {}).get("message", {})
            text_parts = [
                block["text"]
                for block in output_message.get("content", [])
                if "text" in block
            ]
            text = "\n".join(text_parts) if text_parts else ""

            # Extract usage
            usage_meta = data.get("usage", {})
            usage = None
            if usage_meta:
                usage = {
                    "prompt_tokens": usage_meta.get("inputTokens"),
                    "candidates_tokens": usage_meta.get("outputTokens"),
                }

            return {"text": text, "usage": usage, "model": self._model}

        response = self._client.converse(
            modelId=self._model,
            messages=[
                {
                    "role": "user",
                    "content": [{"text": prompt}],
                }
            ],
            inferenceConfig={
                "maxTokens": self._max_tokens,
                "temperature": 0.0,
            },
        )

        # Extract text from the response
        output_message = response.get("output", {}).get("message", {})
        text_parts = [
            block["text"]
            for block in output_message.get("content", [])
            if "text" in block
        ]
        text = "\n".join(text_parts) if text_parts else ""

        # Extract usage
        usage_meta = response.get("usage", {})
        usage = None
        if usage_meta:
            usage = {
                "prompt_tokens": usage_meta.get("inputTokens"),
                "candidates_tokens": usage_meta.get("outputTokens"),
            }

        return {"text": text, "usage": usage, "model": self._model}

    async def generate_stream(self, prompt: str) -> AsyncGenerator[str, None]:
        """
        Stream via Bedrock's ``converse_stream`` API.
        """
        if self._api_key:
            # For now, if API key is used, we fall back to non-streaming for simplicity
            # since EventStream parsing is complex.
            # TODO: Implement binary event-stream parser for httpx
            res = self.generate(prompt)
            yield res["text"]
            return

        import asyncio

        response = await asyncio.to_thread(
            self._client.converse_stream,
            modelId=self._model,
            messages=[
                {
                    "role": "user",
                    "content": [{"text": prompt}],
                }
            ],
            inferenceConfig={
                "maxTokens": self._max_tokens,
                "temperature": 0.0,
            },
        )

        stream = response.get("stream")
        if not stream:
            return

        # Iterate the EventStream (synchronous iterator from boto3)
        for event in stream:
            if "contentBlockDelta" in event:
                delta = event["contentBlockDelta"].get("delta", {})
                text = delta.get("text", "")
                if text:
                    yield text


# ---------------------------------------------------------------------------
# Provider registry & factory
# ---------------------------------------------------------------------------

_PROVIDER_REGISTRY: Dict[str, type] = {
    "gemini": GeminiProvider,
    "bedrock": BedrockProvider,
}

_provider_instance: Optional[LLMProvider] = None


def get_llm_provider() -> LLMProvider:
    """
    Return the singleton LLM provider instance, determined by
    ``settings.LLM_PROVIDER``.

    The provider is lazily initialised on first call.
    """
    global _provider_instance
    if _provider_instance is not None:
        return _provider_instance

    from app.core.config import settings

    key = settings.LLM_PROVIDER.lower()
    provider_cls = _PROVIDER_REGISTRY.get(key)
    if provider_cls is None:
        raise ValueError(
            f"Unknown LLM_PROVIDER '{key}'. "
            f"Available: {', '.join(_PROVIDER_REGISTRY.keys())}"
        )

    _provider_instance = provider_cls()
    return _provider_instance
