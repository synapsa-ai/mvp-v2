# backend/chat/pipe/agent/lyra.py
from __future__ import annotations
import os
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage
from pipe.agent.core.state import ChatState
from pipe.agent.lyra.tools import detectar_risco, sugerir_exercicio, registrar_acolhimento
from pipe.agent.lyra.prompts import LYRA_SYSTEM


def _llm():
    # Ajuste via env MODEL_FAST, se quiser
    return ChatOpenAI(model=os.getenv("MODEL_FAST", "gpt-4o-mini"), temperature=0.2)

def _chat_node(state: ChatState):
    msgs = [SystemMessage(content=LYRA_SYSTEM)] + list(state.get("messages", []))
    res = _llm().invoke(msgs)
    return {"messages": [res]}

def build_lyra_agent():
    G = StateGraph(ChatState)
    G.add_node("chat", _chat_node)
    G.set_entry_point("chat")
    G.add_edge("chat", END)
    return G.compile()

lyra_agent = build_lyra_agent()
