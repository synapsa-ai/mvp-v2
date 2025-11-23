"""
Bridge FastAPI -> LangGraph (Patient/Doctor Agents)
Expõe:
- /api/chat/{agent}
- /assistants/{agent}/invoke
Suporta checkpointer (Postgres ou memória)
"""

from __future__ import annotations
import os
from typing import Any
from contextlib import asynccontextmanager

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from langchain_core.messages import HumanMessage, AIMessage

# === IMPORTA SEUS GRAFOS (AGENTES) =====
# agora corretamente em: pipe/agent/{patient,doctor}.py
from pipe.agent.patient import agent as patient_agent
from pipe.agent.doctor import agent as doctor_agent

# === Checkpoint opcional ==================
try:
    from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
except Exception:
    AsyncPostgresSaver = None

try:
    from langgraph.checkpoint.memory import MemorySaver
except Exception:
    MemorySaver = None


DATABASE_URL = os.getenv("DATABASE_URL")
ALLOW_ORIGINS = os.getenv("ALLOW_ORIGINS", "*")
ALLOW_CREDENTIALS = os.getenv("ALLOW_CREDENTIALS", "false").lower() in ("true", "1", "yes")
DEBUG_LOGS = os.getenv("DEBUG_LOGS", "false").strip().lower() in ("true", "1", "yes")


def dbg(*a, **k):
    if DEBUG_LOGS:
        print(*a, **k)


def normalize_session_id(x: str) -> str:
    x = (x or "").strip()
    return x if x else f"web:{os.urandom(4).hex()}"


def _to_human_messages(text: str):
    return [HumanMessage(content=text)]


def _last_ai_text(messages):
    if not messages:
        return ""
    for m in reversed(messages):
        if isinstance(m, AIMessage):
            return m.content or ""
        if isinstance(m, dict):
            # fallback
            return m.get("content", "") or ""
    return ""


# ===== Checkpointer =====================================================
async def _build_checkpointer():
    if DATABASE_URL and AsyncPostgresSaver:
        cp = await AsyncPostgresSaver.from_conn_string(DATABASE_URL).__aenter__()
        await cp.setup()
        return cp

    if MemorySaver:
        return MemorySaver()

    return None


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.checkpointer = await _build_checkpointer()
    yield


# ===========================================================================
# FastAPI APP
# ===========================================================================
app = FastAPI(title="Synapsa Agent Bridge", version="0.2.0", lifespan=lifespan)

# CORS
origins = ["*"] if ALLOW_ORIGINS == "*" else [o.strip() for o in ALLOW_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=ALLOW_CREDENTIALS,
)

# ========= MAPA DE AGENTES ============
AGENTS = {
    "patient": patient_agent,
    "doctor": doctor_agent,
}

# ===========================================================================
#  /api/chat/{agent}
# ===========================================================================
@app.post("/api/chat/{agent}")
async def chat_route(agent: str, req: Request):
    body = await req.json()
    sid = normalize_session_id(body.get("session_id", "web:anon"))
    text = (body.get("input") or "").strip()

    if not text:
        raise HTTPException(status_code=400, detail="Campo 'input' é obrigatório")

    if agent not in AGENTS:
        raise HTTPException(status_code=404, detail=f"Agente '{agent}' não encontrado")

    graph = AGENTS[agent]

    cfg = {"configurable": {"thread_id": sid}}

    if getattr(app.state, "checkpointer", None) is not None:
        cfg["checkpointer"] = app.state.checkpointer

    try:
        result = await graph.ainvoke({"messages": _to_human_messages(text)}, config=cfg)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao invocar agente: {e}")

    reply = _last_ai_text(result.get("messages") or [])
    return {
        "reply_text": reply,
        "run_id": result.get("run_id", ""),
    }


# ===========================================================================
#  /assistants/{agent}/invoke   (compatível com seu FRONTEND)
# ===========================================================================
# ===========================================================================
#  /assistants/{agent}/invoke   (compatível com FRONTEND)
# ===========================================================================
@app.post("/assistants/{agent}/invoke")
async def assistants_invoke(agent: str, req: Request):
    return await chat_route(agent, req)

# Rota compatível com BASE que já inclui /api
@app.post("/api/assistants/{agent}/invoke")
async def api_assistants_invoke(agent: str, req: Request):
    return await assistants_invoke(agent, req)


# ===========================================================================
#  /health
# ===========================================================================
@app.get("/health")
def health():
    return {"status": "ok"}


# ===========================================================================
# Main
# ===========================================================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("pipe.server.agent_server:app",
                host="0.0.0.0",
                port=int(os.getenv("PORT", "8001")),
                reload=True)
