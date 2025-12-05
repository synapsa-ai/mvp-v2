// src/pacients/pages/Home.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ViewId } from "../PacientApp";
import DiaryHeatmap from "@/components/ui/DiaryHeatmap";

// ----------------------
// MOCK DE ENTRIES DO DIÁRIO
// Depois basta substituir pelo array vindo do MedicalRecord
// ----------------------

const diaryEntries = [
  { day: "Seg", humor: "😊", score: 75, used: 1 },
  { day: "Ter", humor: "😟", score: 40, used: 1 },
  { day: "Qua", humor: "😐", score: 55, used: 1 },
  { day: "Qui", humor: "🤩", score: 85, used: 1 },
  { day: "Sex", humor: "😴", score: 30, used: 0 },
  { day: "Sáb", humor: "😊", score: 70, used: 1 },
  { day: "Dom", humor: "😞", score: 45, used: 1 },
];

// ----------------------
// GERA HEATMAP DE 90 DIAS
// ----------------------

function gerarHeatmap90Dias(usedDates: string[]) {
  const today = new Date();

  const entries: { date: string; used: boolean }[] = [];

  for (let i = 89; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);

    const iso = d.toISOString().slice(0, 10);
    const used = usedDates.includes(iso);

    entries.push({ date: iso, used });
  }

  return entries;
}

// transforma o mock de uso semanal em datas reais
const today = new Date();
const usedDatesMock = diaryEntries
  .filter((d) => d.used === 1)
  .map((_, idx) => {
    const d = new Date();
    d.setDate(today.getDate() - idx);
    return d.toISOString().slice(0, 10);
  });

const heatmap90 = gerarHeatmap90Dias(usedDatesMock);

// ----------------------
// CÁLCULOS DE ESTATÍSTICA
// ----------------------

const totalDiasUsados = heatmap90.filter((d) => d.used).length;

// streak atual
function calcularStreakAtual() {
  let streak = 0;

  for (let i = heatmap90.length - 1; i >= 0; i--) {
    if (heatmap90[i].used) streak++;
    else break;
  }

  return streak;
}

// melhor streak da história
function calcularMelhorStreak() {
  let melhor = 0;
  let atual = 0;

  heatmap90.forEach((d) => {
    if (d.used) {
      atual++;
      if (atual > melhor) melhor = atual;
    } else {
      atual = 0;
    }
  });

  return melhor;
}

const streakAtual = calcularStreakAtual();
const melhorStreak = calcularMelhorStreak();

const weeklyScore =
  Math.round(
    diaryEntries.reduce((acc, d) => acc + d.score, 0) / diaryEntries.length
  ) || 0;

const lastEntry = diaryEntries[diaryEntries.length - 1];

interface HomeProps {
  onNavigate: (view: ViewId) => void;
}

// =====================================================================
// D A S H B O A R D   A T U A L I Z A D O
// =====================================================================

const Home = ({ onNavigate }: HomeProps) => {
  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold">
            Olá, Felipe 👋
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mt-1">
            Seu espaço de autocuidado e acompanhamento emocional.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => onNavigate("schedule")}
          >
            <span className="material-symbols-rounded text-base">event</span>
            Próximos horários
          </Button>

          <Button className="gap-2" onClick={() => onNavigate("aiVoice")}>
            <span className="material-symbols-rounded text-base">mic</span>
            Check-in de voz
          </Button>
        </div>
      </div>

      {/* CARDS PRINCIPAIS */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* CARD DO DIÁRIO */}
        <Card
          className="p-6 shadow-card hover:shadow-elevated transition-smooth cursor-pointer"
          onClick={() => onNavigate("medicalRecord")}
        >
          <div className="flex items-start justify-between mb-4">
            <span className="material-symbols-rounded text-3xl text-primary">
              menu_book
            </span>
            <span className="text-xs text-muted-foreground">
              Último registro: {lastEntry.day}
            </span>
          </div>

          <h3 className="font-heading font-semibold mb-1">Diário emocional</h3>

          <p className="text-sm text-muted-foreground mb-3">
            Seu humor mais recente:{" "}
            <strong className="text-primary">{lastEntry.humor}</strong>.  
            Você registrou{" "}
            <strong className="text-primary">{streakAtual}</strong> dia(s) seguidos.
          </p>

          <p className="text-xs text-primary font-medium">Abrir meu diário →</p>
        </Card>

        {/* CARD CONSULTA */}
        <Card
          className="p-6 shadow-card hover:shadow-elevated transition-smooth cursor-pointer"
          onClick={() => onNavigate("schedule")}
        >
          <div className="flex items-start justify-between mb-4">
            <span className="material-symbols-rounded text-3xl text-secondary">
              event
            </span>
            <span className="text-xs text-muted-foreground">Amanhã</span>
          </div>

          <h3 className="font-heading font-semibold mb-1">Próxima consulta</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Dr. João Silva — 15:00
          </p>

          <p className="text-xs text-secondary font-medium">
            Ver agendamentos →
          </p>
        </Card>

        {/* CARD LYRA */}
        <Card className="p-6 shadow-card gradient-primary text-white flex flex-col justify-between">
          <div>
            <span className="material-symbols-rounded text-3xl mb-4 block">
              favorite
            </span>
            <h3 className="font-heading font-semibold mb-1">
              Cuide de você hoje
            </h3>
            <p className="text-sm text-white/80 mb-4">
              Tire 2 minutos e reflita sobre como você está se sentindo.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="self-start"
            onClick={() => onNavigate("aiVoice")}
          >
            Abrir com a Lyra
          </Button>
        </Card>
      </div>

      {/* SCORE DA SEMANA */}
      <Card className="p-6 shadow-card">
        <h3 className="font-heading font-semibold mb-1">
          Seu score emocional da semana
        </h3>

        <p className="text-4xl font-bold text-primary">{weeklyScore}</p>

        <p className="text-muted-foreground text-sm mt-1">
          Baseado em consistência e humor registrado.
        </p>
      </Card>

      {/* ESTATÍSTICAS AVANÇADAS */}
      <Card className="p-6 shadow-card">
        <h3 className="font-heading font-semibold mb-4">Estatísticas gerais</h3>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-xl font-bold">{totalDiasUsados}</p>
            <p className="text-xs text-muted-foreground">Dias usados</p>
          </div>

          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-xl font-bold">{streakAtual}</p>
            <p className="text-xs text-muted-foreground">Streak atual</p>
          </div>

          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-xl font-bold">{melhorStreak}</p>
            <p className="text-xs text-muted-foreground">Melhor streak</p>
          </div>
        </div>
      </Card>

      {/* HEATMAP GITHUB 90 DIAS */}
      <Card className="p-6 shadow-card">
        <h3 className="font-heading font-semibold mb-4">
          Seu uso do diário nos últimos 90 dias
        </h3>

        <DiaryHeatmap entries={heatmap90} />
      </Card>
    </div>
  );
};

export default Home;
