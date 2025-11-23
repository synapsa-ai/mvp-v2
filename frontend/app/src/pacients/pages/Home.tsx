// src/pacients/pages/Home.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { ViewId } from "../PacientApp";

const wellbeingData = [
  { day: "Seg", score: 65 },
  { day: "Ter", score: 70 },
  { day: "Qua", score: 68 },
  { day: "Qui", score: 72 },
  { day: "Sex", score: 75 },
  { day: "Sáb", score: 78 },
  { day: "Dom", score: 80 },
];

interface HomeProps {
  onNavigate: (view: ViewId) => void;
}

const Home = ({ onNavigate }: HomeProps) => {
  return (
    <div className="flex flex-col gap-8">
      {/* Header interno da página */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold">
            Olá, Felipe 👋
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mt-1">
            Como você está se sentindo hoje? Aqui você acompanha seus check-ins
            emocionais e próximos passos.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => onNavigate("schedule")}
          >
            <span className="material-symbols-rounded text-base">event</span>
            Ver próximos horários
          </Button>
          <Button className="gap-2" onClick={() => onNavigate("aiVoice")}>
            <span className="material-symbols-rounded text-base">mic</span>
            Fazer check-in de voz
          </Button>
        </div>
      </div>

      {/* Cards principais */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card
          className="p-6 shadow-card hover:shadow-elevated transition-smooth cursor-pointer"
          onClick={() => onNavigate("aiVoice")}
        >
          <div className="flex items-start justify-between mb-4">
            <span className="material-symbols-rounded text-3xl text-primary">
              psychology
            </span>
            <span className="text-xs text-muted-foreground">2 dias atrás</span>
          </div>
          <h3 className="font-heading font-semibold mb-1">
            Última análise de voz
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Nível moderado de estresse detectado.
          </p>
          <p className="text-xs text-primary font-medium">Ver detalhes →</p>
        </Card>

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
          <h3 className="font-heading font-semibold mb-1">
            Próxima consulta
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Dr. João Silva — 15:00
          </p>
          <p className="text-xs text-secondary font-medium">
            Ver agendamentos →
          </p>
        </Card>

        <Card className="p-6 shadow-card gradient-primary text-white flex flex-col justify-between">
          <div>
            <span className="material-symbols-rounded text-3xl mb-4 block">
              favorite
            </span>
            <h3 className="font-heading font-semibold mb-1">
              Cuide de você hoje
            </h3>
            <p className="text-sm text-white/80 mb-4">
              Reserve 2 minutos para registrar como você está se sentindo.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="self-start"
            onClick={() => onNavigate("aiVoice")}
          >
            Abrir chat com a Lyra
          </Button>
        </Card>
      </div>

      {/* Gráfico simples de bem-estar */}
      <Card className="p-6 shadow-card">
        <h3 className="font-heading font-semibold mb-4">
          Sua curva de bem-estar nesta semana
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={wellbeingData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
            />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Home;
