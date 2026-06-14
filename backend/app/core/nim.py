from __future__ import annotations

import asyncio
from typing import Any

import httpx

from app.core.config import settings


RETRYABLE_STATUSES = {408, 409, 425, 429, 500, 502, 503, 504}


def nim_models(primary: str | None = None) -> list[str]:
    models = [
        primary or settings.nvidia_nim_model,
        settings.nvidia_nim_fallback_model,
    ]
    return list(dict.fromkeys(model for model in models if model))


async def post_nim_chat_completion(
    payload: dict[str, Any],
    *,
    model: str | None = None,
    timeout: float = 60,
    max_retries: int = 3,
) -> httpx.Response:
    if not settings.nvidia_nim_api_key:
        raise RuntimeError("NVIDIA_NIM_API_KEY is not configured")

    last_error: Exception | None = None
    async with httpx.AsyncClient(timeout=timeout) as client:
        for model_name in nim_models(model):
            model_payload = {**payload, "model": model_name}
            for attempt in range(max_retries + 1):
                try:
                    response = await client.post(
                        f"{settings.nvidia_nim_base_url.rstrip('/')}/chat/completions",
                        headers={
                            "Authorization": f"Bearer {settings.nvidia_nim_api_key}",
                            "Content-Type": "application/json",
                        },
                        json=model_payload,
                    )
                    if response.is_success:
                        return response
                    if response.status_code in {401, 403}:
                        response.raise_for_status()
                    if response.status_code not in RETRYABLE_STATUSES:
                        last_error = httpx.HTTPStatusError(
                            f"NVIDIA NIM model {model_name} failed with status {response.status_code}",
                            request=response.request,
                            response=response,
                        )
                        break
                    if attempt == max_retries:
                        last_error = httpx.HTTPStatusError(
                            f"NVIDIA NIM model {model_name} failed after retries with status {response.status_code}",
                            request=response.request,
                            response=response,
                        )
                        break
                    retry_after = response.headers.get("retry-after")
                    try:
                        delay = float(retry_after) if retry_after else 0
                    except ValueError:
                        delay = 0
                    if delay <= 0:
                        delay = min(60, 4 * (2**attempt))
                    await asyncio.sleep(delay)
                except Exception as exc:
                    last_error = exc
                    if attempt == max_retries:
                        break
                    await asyncio.sleep(min(60, 4 * (2**attempt)))

    if last_error:
        raise last_error
    raise RuntimeError("NVIDIA NIM request failed without returning a response")
