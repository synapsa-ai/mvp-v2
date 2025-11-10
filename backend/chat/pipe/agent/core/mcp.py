from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, field
from zoneinfo import ZoneInfo
from datetime import datetime, timedelta

TZ = ZoneInfo("America/Sao_Paulo")

# ---------------- In-memory "DB" (mock) ----------------
@dataclass
class Paciente:
    id: str
    nome: str
    contato: str
    nascimento: Optional[str] = None
    observacoes: Optional[str] = None

@dataclass
class Compromisso:
    id: str
    paciente_id: str
    profissional: str
    inicio: datetime
    duracao_min: int
    modalidade: str  # "online" | "presencial"
    contato_confirmacao: str

class DB:
    pacientes: Dict[str, Paciente] = {}
    compromissos: Dict[str, Compromisso] = {}
    seq: int = 0

    @classmethod
    def next_id(cls, prefix="id") -> str:
        cls.seq += 1
        return f"{prefix}_{cls.seq}"
