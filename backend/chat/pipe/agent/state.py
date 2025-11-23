# pipe/agent/state.py
from __future__ import annotations

from typing import List, Optional
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage


class PatientState(TypedDict, total=False):
    messages: List[BaseMessage]
    risk_level: Optional[str]


class DoctorState(TypedDict, total=False):
    messages: List[BaseMessage]
    patient_id: str
