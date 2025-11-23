# pipe/agent/tools_patient.py
from __future__ import annotations
from langchain_core.tools import tool


@tool
def analisar_sentimento(texto: str) -> str:
    """Analisa o texto do paciente e retorna uma classificação de risco simples."""
    # TODO: lógica real
    return "risco_baixo"


@tool
def marcar_consulta(paciente_id: str, profissional_id: str) -> str:
    """Simula a marcação de uma consulta e retorna um identificador."""
    # TODO: integrar com agenda real
    return f"consulta_{paciente_id}_{profissional_id}"


@tool
def registro_diario(paciente_id: str, texto: str) -> str:
    """Registra um diário emocional e retorna um id do registro."""
    # TODO: salvar em DB
    return "diario_0001"


PATIENT_TOOLS = [analisar_sentimento, marcar_consulta, registro_diario]
