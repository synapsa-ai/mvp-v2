# backend/chat/pipe/agent/tools.py
from __future__ import annotations
from typing import List, Dict, Optional, Tuple
from langchain.tools import tool
from datetime import datetime, timedelta

# ---------------- Helpers ----------------
def _parse_dt(s: str) -> datetime:
    # aceita "YYYY-MM-DD HH:MM"
    return datetime.strptime(s.strip(), "%Y-%m-%d %H:%M").replace(tzinfo=TZ)

def _is_business_time(dt: datetime) -> bool:
    # seg-sex 08:00-20:00
    if dt.weekday() >= 5:
        return False
    return 8 <= dt.hour < 20

def _range_overlap(a_start: datetime, a_end: datetime, b_start: datetime, b_end: datetime) -> bool:
    return max(a_start, b_start) < min(a_end, b_end)

def _agenda_do_prof(prof: str) -> List[Compromisso]:
    return [c for c in DB.compromissos.values() if c.profissional.lower() == prof.lower()]

def _tem_conflito(prof: str, inicio: datetime, duracao: int, ignore_id: Optional[str] = None) -> bool:
    fim = inicio + timedelta(minutes=duracao)
    for c in _agenda_do_prof(prof):
        if ignore_id and c.id == ignore_id:
            continue
        if _range_overlap(inicio, fim, c.inicio, c.inicio + timedelta(minutes=c.duracao_min)):
            return True
    return False

# ---------------- SIN: Tools de agenda/admin ----------------
@tool("validar_data_hora", return_direct=False)
def validar_data_hora(inicio_str: str, duracao_min: int, profissional: str) -> dict:
    """
    Valida data/hora (horário comercial seg-sex 08-20, sem finais de semana) e conflito na agenda.
    Retorna {"ok": bool, "motivo": str|None, "inicio_iso": str, "fim_iso": str, "conflito": bool}.
    """
    try:
        inicio = _parse_dt(inicio_str)
    except Exception:
        return {"ok": False, "motivo": "Formato inválido (use YYYY-MM-DD HH:MM).", "inicio_iso": "", "fim_iso": "", "conflito": False}

    if not _is_business_time(inicio):
        return {"ok": False, "motivo": "Fora do horário comercial ou fim de semana.", "inicio_iso": inicio.isoformat(), "fim_iso": "", "conflito": False}

    conflito = _tem_conflito(profissional, inicio, duracao_min)
    fim = inicio + timedelta(minutes=duracao_min)
    return {"ok": not conflito, "motivo": "Conflito na agenda." if conflito else None, "inicio_iso": inicio.isoformat(), "fim_iso": fim.isoformat(), "conflito": conflito}

@tool("consultar_agenda", return_direct=False)
def consultar_agenda(profissional: str, inicio_str: str, fim_str: str) -> dict:
    """
    Lista compromissos do profissional no intervalo.
    Retorna {"compromissos": [{id, paciente_id, inicio_iso, fim_iso, modalidade}], "total": int}
    """
    inicio = _parse_dt(inicio_str)
    fim = _parse_dt(fim_str)
    out = []
    for c in _agenda_do_prof(profissional):
        c_end = c.inicio + timedelta(minutes=c.duracao_min)
        if _range_overlap(inicio, fim, c.inicio, c_end):
            out.append({
                "id": c.id,
                "paciente_id": c.paciente_id,
                "inicio_iso": c.inicio.isoformat(),
                "fim_iso": c_end.isoformat(),
                "modalidade": c.modalidade
            })
    out.sort(key=lambda x: x["inicio_iso"])
    return {"compromissos": out, "total": len(out)}

@tool("agendar", return_direct=False)
def agendar(nome_paciente: str, contato: str, profissional: str, inicio_str: str, duracao_min: int, modalidade: str) -> dict:
    """
    Cria paciente (se necessário) e agenda. Retorna {"ok": bool, "id": str|None, "resumo": str, "motivo": str|None}
    """
    inicio = _parse_dt(inicio_str)
    if not _is_business_time(inicio):
        return {"ok": False, "id": None, "resumo": "", "motivo": "Fora do horário comercial ou fim de semana."}
    if _tem_conflito(profissional, inicio, duracao_min):
        return {"ok": False, "id": None, "resumo": "", "motivo": "Conflito na agenda."}

    # paciente (idempotente pelo nome+contato, simplificado)
    pid = None
    for p in DB.pacientes.values():
        if p.nome.strip().lower() == nome_paciente.strip().lower() and p.contato.strip() == contato.strip():
            pid = p.id
            break
    if pid is None:
        pid = DB.next_id("pac")
        DB.pacientes[pid] = Paciente(id=pid, nome=nome_paciente.strip(), contato=contato.strip())

    cid = DB.next_id("cmp")
    DB.compromissos[cid] = Compromisso(
        id=cid, paciente_id=pid, profissional=profissional.strip(),
        inicio=inicio, duracao_min=duracao_min, modalidade=modalidade.strip().lower(),
        contato_confirmacao=contato.strip()
    )
    fim = inicio + timedelta(minutes=duracao_min)
    resumo = f"{nome_paciente} com {profissional} em {inicio.strftime('%d/%m %H:%M')}–{fim.strftime('%H:%M')} ({modalidade})."
    return {"ok": True, "id": cid, "resumo": resumo, "motivo": None}

@tool("remarcar", return_direct=False)
def remarcar(compromisso_id: str, novo_inicio_str: str, nova_duracao_min: Optional[int] = None) -> dict:
    """
    Remarca compromisso. Retorna {"ok": bool, "resumo": str|None, "motivo": str|None}
    """
    c = DB.compromissos.get(compromisso_id)
    if not c:
        return {"ok": False, "resumo": None, "motivo": "Compromisso não encontrado."}
    novo_inicio = _parse_dt(novo_inicio_str)
    dur = nova_duracao_min or c.duracao_min
    if not _is_business_time(novo_inicio):
        return {"ok": False, "resumo": None, "motivo": "Fora do horário comercial ou fim de semana."}
    if _tem_conflito(c.profissional, novo_inicio, dur, ignore_id=c.id):
        return {"ok": False, "resumo": None, "motivo": "Conflito na agenda."}

    c.inicio = novo_inicio
    c.duracao_min = dur
    fim = c.inicio + timedelta(minutes=c.duracao_min)
    return {"ok": True, "resumo": f"{c.id} remarcado para {c.inicio.strftime('%d/%m %H:%M')}–{fim.strftime('%H:%M')}", "motivo": None}

@tool("cancelar", return_direct=False)
def cancelar(compromisso_id: str) -> dict:
    """
    Cancela compromisso. Retorna {"ok": bool, "resumo": str|None, "motivo": str|None}
    """
    c = DB.compromissos.pop(compromisso_id, None)
    if not c:
        return {"ok": False, "resumo": None, "motivo": "Compromisso não encontrado."}
    return {"ok": True, "resumo": f"{compromisso_id} cancelado.", "motivo": None}

@tool("registrar_paciente", return_direct=False)
def registrar_paciente(nome: str, contato: str, nascimento: Optional[str] = None, observacoes: Optional[str] = None) -> dict:
    """
    Cria ficha do paciente. Retorna {"ok": bool, "id": str, "resumo": str}
    """
    pid = DB.next_id("pac")
    DB.pacientes[pid] = Paciente(id=pid, nome=nome.strip(), contato=contato.strip(), nascimento=nascimento, observacoes=observacoes)
    return {"ok": True, "id": pid, "resumo": f"Paciente {nome} cadastrado (id {pid})."}
