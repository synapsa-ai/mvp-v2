# pipe/agent/doctor.py
from __future__ import annotations

import os
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI

from pipe.agent.state import DoctorState
from pipe.agent.prompts import LYRA_DOCTOR_SYSTEM
from pipe.agent.tools_doctor import DOCTOR_TOOLS


def _llm_doctor():
    return ChatOpenAI(
        model=os.getenv("MODEL_SLOW", "gpt-4o"),
        temperature=0.1,
    )


def build_doctor_agent():
    return create_react_agent(
    _llm_doctor(),
    tools=DOCTOR_TOOLS,
    prompt=LYRA_DOCTOR_SYSTEM,
)



agent = build_doctor_agent()
