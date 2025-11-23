# pipe/agent/patient.py
from __future__ import annotations

import os
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI

from pipe.agent.state import PatientState
from pipe.agent.prompts import LYRA_PATIENT_SYSTEM
from pipe.agent.tools_patient import PATIENT_TOOLS


def _llm_patient():
    return ChatOpenAI(
        model=os.getenv("MODEL_FAST", "gpt-4o-mini"),
        temperature=0.2,
    )


def build_patient_agent():
    return create_react_agent(
    _llm_patient(),
    tools=PATIENT_TOOLS,
    prompt=LYRA_PATIENT_SYSTEM,
)



# É ISSO que o langgraph.json referencia em "pipe/agent/patient.py:agent"
agent = build_patient_agent()
