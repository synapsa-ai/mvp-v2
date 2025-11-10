
# ---------------- LYRA: Tools de acolhimento ----------------
from __future__ import annotations
from typing import List, Dict, Optional, Tuple
from langchain.tools import tool
from pipe.agent.lyra.keywords import _EXERCICIOS, _RISCO_PALAVRAS
from typing import List, Dict, Optional, Tuple
from datetime import datetime, timedelta
from ..core.mcp import *
from langchain.tools import tool

def _classificar_risco(txt: str) -> Tuple[str, List[str]]:
    t = txt.lower()
    for nivel in ["alto", "moderado", "baixo"]:
        hits = [w for w in _RISCO_PALAVRAS[nivel] if w in t]
        if hits:
            return nivel, hits
    return "indeterminado", []

@tool("detectar_risco", return_direct=False)
def detectar_risco(texto: str) -> dict:
    """
    Heurística simples de risco. Retorna {"nivel": "alto|moderado|baixo|indeterminado", "evidencias": [..], "recomendacao": str}
    """
    nivel, evid = _classificar_risco(texto)
    rec = {
        "alto": "Risco agudo. Incentive ajuda IMEDIATA (SAMU 192 / CAPS / familiar próximo) e permaneça acolhendo até garantir suporte.",
        "moderado": "Acolha, explore rede de apoio e sugira contato com profissional. Combine um plano de segurança breve.",
        "baixo": "Acolha, normalize e ofereça exercício simples. Avalie se deseja conversa guiada ou encaminhamento.",
        "indeterminado": "Continue acolhendo e investigando com cuidado. Ofereça exercício breve e veja interesse em acompanhamento.",
    }[nivel]
    return {"nivel": nivel, "evidencias": evid, "recomendacao": rec}

@tool("sugerir_exercicio", return_direct=False)
def sugerir_exercicio(tipo: Optional[str] = None) -> dict:
    """
    Sugere 1 exercício prático imediato. tipo opcional: 'respiracao', 'grounding', 'alongamento'.
    Retorna {"nome": str, "passos": [..], "duracao_min": int}
    """
    key = "respiracao_4_7_8"
    if tipo:
        t = tipo.lower()
        if t.startswith("resp"):
            key = "respiracao_4_7_8"
        elif t.startswith("gro"):
            key = "grounding_5_4_3_2_1"
        elif t.startswith("alo") or t.startswith("along"):
            key = "alongamento_pescoço_ombros"
    ex = _EXERCICIOS[key]
    return {"nome": ex["nome"], "passos": ex["passos"], "duracao_min": ex["duracao_min"]}

@tool("registrar_acolhimento", return_direct=False)
def registrar_acolhimento(paciente_nome: str, resumo: str, nivel_risco: str) -> dict:
    """
    Loga um atendimento de acolhimento (mock). Retorna {"ok": bool, "resumo": str}
    """
    log_id = DB.next_id("acolh")
    return {"ok": True, "resumo": f"Acolhimento {log_id} salvo para {paciente_nome} (risco {nivel_risco})."}
