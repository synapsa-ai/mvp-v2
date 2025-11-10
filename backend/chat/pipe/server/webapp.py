# backend/chat/pipe/server/webapp.py
from __future__ import annotations
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from langchain_core.messages import HumanMessage, AIMessage

# === importe os agentes ===
# lyra
from pipe.agent.lyra.lyra import lyra_agent
# sin (se quiser habilitar também)
from pipe.agent.sin.sin import sin_agent

app = FastAPI(title="Clinical Chat (LangGraph puro)")

# CORS p/ o front do Vite (8080). Ajuste se usar outra origem.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8080", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------- helpers --------
def normalize_session_id(s: str) -> str:
    s = (s or "").strip()
    return s if s else "web:anon"

def cfg(session_id: str):
    return {"configurable": {"thread_id": session_id}}

def _to_human_messages(text: str):
    if not isinstance(text, str):
        text = str(text or "")
    text = text.strip()
    return [HumanMessage(content=text)]

def _last_ai_text(messages):
    for m in reversed(messages or []):
        if isinstance(m, AIMessage):
            return m.content or ""
        if isinstance(m, dict):
            if m.get("type") in ("ai", "assistant"):
                return m.get("content", "") or ""
            if m.get("role") in ("assistant", "ai"):
                return m.get("content", "") or ""
    return ""

# mapa de agentes disponíveis
AGENTS = {
    "lyra": lyra_agent,
    "sin": sin_agent,  # se ainda não quiser expor, remova esta linha
}

# -------- endpoints --------
@app.post("/chat/{agent_id}")
async def chat_agent(agent_id: str, req: Request):
    agent = AGENTS.get(agent_id)
    if agent is None:
        raise HTTPException(status_code=404, detail=f"Agente desconhecido: {agent_id}")

    body = await req.json()
    sid = normalize_session_id(body.get("session_id", "web:anon"))
    text = (body.get("input") or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Campo 'input' é obrigatório")

    try:
        state_in = {"messages": _to_human_messages(text)}
        result = await agent.ainvoke(state_in, config=cfg(sid))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao invocar agente: {e}")

    reply = _last_ai_text(result.get("messages") or [])
    return {"reply_text": reply, "trace_id": result.get("run_id", "")}

# atalhos convenientes (o teu front já usa /chat/lyra)
@app.post("/chat/lyra")
async def chat_lyra(req: Request):
    return await chat_agent("lyra", req)

@app.post("/chat/sin")
async def chat_sin(req: Request):
    return await chat_agent("sin", req)

# SSE opcional (se quiser stream com um agente específico)
@app.get("/stream/{agent_id}")
async def stream(agent_id: str, session_id: str, input: str):
    agent = AGENTS.get(agent_id)
    if agent is None:
        raise HTTPException(status_code=404, detail=f"Agente desconhecido: {agent_id}")
    sid = normalize_session_id(session_id)

    async def gen():
        state_in = {"messages": _to_human_messages(input)}
        async for chunk in agent.astream(state_in, config=cfg(sid)):
            yield f"data: {chunk}\n\n"
        yield "event: done\ndata: {}\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream")

# Stub de transcrição para não quebrar o front.
# Troque pelo seu motor real depois.
@app.post("/transcribe")
async def transcribe_stub(req: Request):
    # Ex.: retornar sempre um texto fixo por enquanto
    return JSONResponse({"text": "[transcrição de teste]"})
