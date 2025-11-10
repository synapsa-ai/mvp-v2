# pipe/agent/core/state.py
from __future__ import annotations
from typing import Sequence, Optional, Dict, List, Any
from typing_extensions import Annotated, TypedDict
from langchain_core.messages import AnyMessage
from langgraph.graph.message import add_messages

class ChatState(TypedDict, total=False):
    # Histórico de chat
    messages: Annotated[Sequence[AnyMessage], add_messages]

    # Campos opcionais que seus nós podem usar
    user_input: Optional[str]
    last_intent: Optional[str]
    last_command: Optional[str]

    # Flags de fluxo
    ran_pipeline: Optional[bool]
    router_asked: Optional[bool]
