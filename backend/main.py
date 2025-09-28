from __future__ import annotations

import os
from typing import Any, Dict, List, Optional
from dotenv import load_dotenv
import httpx
from fastapi import Depends, FastAPI, Header, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


load_dotenv()
SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    # Do not crash; Render may set envs after build. But warn loudly.
    print("[WARN] Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.")


def _allowed_origins_from_env() -> List[str]:
    raw = os.environ.get("CORS_ORIGINS", "").strip()
    if not raw:
        return [
            "http://localhost:3000",
            "https://joelmbaka.vercel.app",
        ]
    return [o.strip() for o in raw.split(",") if o.strip()]


app = FastAPI(title="Portfolio Backend", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins_from_env(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class ProductIn(BaseModel):
    name: str
    brand: str
    type: str
    warrantyMonths: int = Field(ge=0)
    startDate: str  # ISO date yyyy-mm-dd


async def get_user_id(authorization: Optional[str] = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    token = authorization[7:]
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        raise HTTPException(status_code=500, detail="Server not configured")

    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {token}",
    }
    auth_url = f"{SUPABASE_URL}/auth/v1/user"
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(auth_url, headers=headers)
    if resp.status_code != 200:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = resp.json()
    user_id = user.get("id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user payload")
    return user_id


@app.get("/health")
async def health() -> Dict[str, Any]:
    return {"ok": True}


@app.get("/products")
async def list_products(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    token = authorization[7:]

    user_id = await get_user_id(authorization)

    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        raise HTTPException(status_code=500, detail="Server not configured")

    rest_url = f"{SUPABASE_URL}/rest/v1/products"
    params = {
        "user_id": f"eq.{user_id}",
        "order": "created_at.desc",
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(
            rest_url,
            params=params,
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {token}",
                "Accept": "application/json",
            },
        )
    if resp.status_code != 200:
        print("[REST_ERROR] GET /products:", resp.text)
        raise HTTPException(status_code=resp.status_code, detail="Failed to fetch products")
    return {"items": resp.json() or []}


# removed duplicate GET /products and unused helper


@app.post("/products")
async def create_product(payload: ProductIn, authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    token = authorization[7:]

    user_id = await get_user_id(authorization)

    rest_url = f"{SUPABASE_URL}/rest/v1/products"
    data = {
        "user_id": user_id,
        "name": payload.name.strip(),
        "brand": payload.brand.strip(),
        "type": payload.type.strip(),
        "warranty_months": int(payload.warrantyMonths),
        "start_date": payload.startDate,
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.post(
            rest_url,
            json=data,
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
                "Prefer": "return=representation",
            },
        )
    if resp.status_code not in (200, 201):
        print("[REST_ERROR] POST /products:", resp.text)
        raise HTTPException(status_code=resp.status_code, detail="Failed to create product")
    # PostgREST returns an array when Prefer:return=representation is used
    body = resp.json()
    item = body[0] if isinstance(body, list) else body
    return {"item": item}


# Render start: uvicorn main:app --host 0.0.0.0 --port 8000
