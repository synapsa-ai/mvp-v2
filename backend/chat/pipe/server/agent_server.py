"""
Bridge FastAPI -> LangGraph (Lyra/SIN)
- Exponde /api/chat/{agent} para o front atual
- (Opcional) expõe /<AGENT_ENDPOINT_PATH> para CopilotKit/AG-UI
- Checkpoint: usa Postgres se DATABASE_URL estiver setada; senão MemorySaver
"""

from __future__ import annotations
import os
import time
from typing import Any
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from langchain_core.messages import HumanMessage, AIMessage

# === LangGraph: seus agentes ===
from pipe.agent.lyra.lyra import lyra_agent   # grafo compilado
from pipe.agent.sin.sin import sin_agent      # grafo compilado

# === Checkpoint (opcional) ===
try:
    from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
except Exception:
    AsyncPostgresSaver = None  # type: ignore

try:
    from langgraph.checkpoint.memory import MemorySaver
except Exception:
    MemorySaver = None  # type: ignore

# === (Opcional) AG-UI/CopilotKit ===
try:
    from copilotkit import CopilotKitSDK, LangGraphAgent
    from copilotkit.integrations.fastapi import add_fastapi_endpoint
except Exception:
    CopilotKitSDK = None  # type: ignore
    LangGraphAgent = None  # type: ignore
    add_fastapi_endpoint = None  # type: ignore

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
ALLOW_ORIGINS = os.getenv("ALLOW_ORIGINS", "*")
ALLOW_CREDENTIALS = os.getenv("ALLOW_CREDENTIALS", "false").lower() in ("true", "1", "yes")
AGENT_ENDPOINT_PATH = os.getenv("AGENT_ENDPOINT_PATH", "/genesis")
DEBUG_LOGS = os.getenv("DEBUG_LOGS", "false").strip().lower() in ("true", "1", "yes")

def dbg(*a, **k):
    if DEBUG_LOGS:
        try:
            print(*a, **k)
        except Exception:
            pass

def normalize_session_id(x: str) -> str:
    x = (x or "").strip()
    return x if x else f"web:{os.urandom(4).hex()}"

def _to_human_messages(text: str):
    return [HumanMessage(content=(text or "").strip())]

def _last_ai_text(messages):
    for m in reversed(messages or []):
        if isinstance(m, AIMessage):
            return m.content or ""
        if isinstance(m, dict):
            if m.get("type") in ("ai", "assistant") or m.get("role") in ("assistant", "ai"):
                return m.get("content", "") or ""
    return ""

# Preparar checkpointer se quiser persistência
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

    # (Opcional) integra CopilotKit/AG-UI, se disponível
    if CopilotKitSDK and LangGraphAgent and add_fastapi_endpoint:
        def build_agents(context):
            headers = {k.lower(): v for k, v in (context.get("headers") or {}).items()}
            user_id = headers.get("x-user-id")
            lg_cfg: dict[str, Any] = {}
            if user_id:
                lg_cfg["context"] = {"user_id": user_id}
                lg_cfg["configurable"] = {"user_id": user_id}
            return [
                LangGraphAgent(name="lyra", description="Agente Lyra", graph=lyra_agent, langgraph_config=lg_cfg or None),
                LangGraphAgent(name="sin",  description="Agente SIN",  graph=sin_agent,  langgraph_config=lg_cfg or None),
            ]
        sdk = CopilotKitSDK(agents=build_agents)
        add_fastapi_endpoint(app, sdk, AGENT_ENDPOINT_PATH)
        app.state.copilot_sdk = sdk

    yield

app = FastAPI(title="Synapsa Bridge API", version="0.1.0", lifespan=lifespan)

# CORS
origins = [o.strip() for o in ALLOW_ORIGINS.split(",") if o.strip()] if ALLOW_ORIGINS != "*" else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=ALLOW_CREDENTIALS,
)

# ---------- REST simples p/ FRONT ----------
@app.post("/api/chat/{agent}")
async def chat_route(agent: str, req: Request):
    body = await req.json()
    sid = normalize_session_id(body.get("session_id", "web:anon"))
    text = (body.get("input") or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Campo 'input' é obrigatório")

    if agent not in ("lyra", "sin"):
        raise HTTPException(status_code=404, detail=f"Agente '{agent}' não encontrado")

    graph = lyra_agent if agent == "lyra" else sin_agent
    cfg = {"configurable": {"thread_id": sid}}
    if getattr(app.state, "checkpointer", None) is not None:
        cfg["checkpointer"] = app.state.checkpointer  # type: ignore

    try:
        result = await graph.ainvoke({"messages": _to_human_messages(text)}, config=cfg)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao invocar agente: {e}")

    reply = _last_ai_text(result.get("messages") or [])
    return {"reply_text": reply, "run_id": result.get("run_id", "")}

# (Opcional) health e copilot info
@app.get("/health")
def health(): return {"status": "ok"}

@app.post(f"{AGENT_ENDPOINT_PATH.rstrip('/')}/info")
@app.get(f"{AGENT_ENDPOINT_PATH.rstrip('/')}/info")
async def copilot_info(request: Request):
    sdk = getattr(app.state, "copilot_sdk", None)
    if not sdk:
        return JSONResponse(content={"error": "SDK not initialized"}, status_code=503)
    try:
        body = await request.json()
    except Exception:
        body = {}
    context = {
        "properties": body.get("properties", {}),
        "frontend_url": body.get("frontendUrl"),
        "headers": dict(request.headers or {}),
    }
    return JSONResponse(content=sdk.info(context=context))

@app.post("/api/assistants/{agent}/invoke")
async def assistants_invoke(agent: str, req: Request):
    # Rota compatível com clientes que esperam o formato “assistants/{agent}/invoke”
    # Reaproveita exatamente a mesma lógica do /api/chat/{agent}
    return await chat_route(agent, req)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("pipe.server.agent_server:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), reload=True)
