# backend/chat/pipe/agent/sin.py
from __future__ import annotations
import os
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage
from langchain.tools import tool
from pipe.agent.core.state import ChatState
from pipe.agent.sin.prompts import SIN_SYSTEM
from pipe.agent.sin.tools import (
    agendar, remarcar, cancelar, validar_data_hora, consultar_agenda, registrar_paciente
)

def _llm():
    return ChatOpenAI(model=os.getenv("MODEL_FAST", "gpt-4o-mini"), temperature=0.2)

def _chat_node(state: ChatState):
    msgs = [SystemMessage(content=SIN_SYSTEM)] + list(state.get("messages", []))
    res = _llm().invoke(msgs)
    return {"messages": [res]}

def build_sin_agent():
    G = StateGraph(ChatState)
    G.add_node("chat", _chat_node)
    G.set_entry_point("chat")
    G.add_edge("chat", END)
    return G.compile()

sin_agent = build_sin_agent()
