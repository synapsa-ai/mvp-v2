# pipe/agent/tools_doctor.py
from __future__ import annotations
from langchain_core.tools import tool


@tool
def historico_risco(paciente_id: str) -> str:
    """Retorna um histórico resumido de risco do paciente."""
    # TODO: puxar do DB real
    return f"Histórico de risco do paciente {paciente_id}: risco baixo na maior parte do tempo."


@tool
def resumo_paciente(paciente_id: str) -> str:
    """Retorna um resumo clínico do paciente."""
    # TODO: consolidar diários, eventos, etc.
    return f"Resumo clínico do paciente {paciente_id}: queixas principais, gatilhos e progressos."


DOCTOR_TOOLS = [historico_risco, resumo_paciente]
