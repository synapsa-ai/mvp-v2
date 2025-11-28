// src/pacients/pages/Schedule.tsx
import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, List } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function SchedulePaciente() {
  // MOCK - troque por useApp().consultas no futuro
  const consultasMock = [
    {
      id: "1",
      data: "2025-11-30",
      hora: "14:00",
      local: "online",
      status: "confirmado",
      observacoes: "Sessão focada em ansiedade.",
      valor: 200
    },
    {
      id: "2",
      data: "2025-12-02",
      hora: "10:30",
      local: "presencial",
      status: "confirmado",
      observacoes: "Revisão semanal.",
      valor: 200
    }
  ];

  const [visualizacao, setVisualizacao] = useState<"mes" | "semana" | "lista">("mes");
  const [dataAtual, setDataAtual] = useState(new Date());
  const [consultaSelecionada, setConsultaSelecionada] = useState<any | null>(null);

  const proximoMes = () => {
    const nova = new Date(dataAtual);
    nova.setMonth(nova.getMonth() + 1);
    setDataAtual(nova);
  };

  const mesAnterior = () => {
    const nova = new Date(dataAtual);
    nova.setMonth(nova.getMonth() - 1);
    setDataAtual(nova);
  };

  const consultasDoDia = (data: Date) => {
    const dataStr = data.toISOString().split("T")[0];
    return consultasMock.filter(c => c.data === dataStr);
  };

  const getDiasDoMes = () => {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const dias = [];

    for (let i = 0; i < primeiroDia.getDay(); i++) dias.push(null);
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      dias.push(new Date(ano, mes, dia));
    }

    return dias;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado": return "bg-green-500/10 text-green-700";
      case "cancelado": return "bg-red-500/10 text-red-700";
      case "reagendado": return "bg-blue-500/10 text-blue-700";
      default: return "bg-gray-500/10 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Agenda</h1>
        <p className="text-muted-foreground">
          Veja suas consultas futuras e passadas
        </p>
      </div>

      {/* CONTROLES */}
      <Card>
        <CardContent className="pt-6 flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant={visualizacao === "mes" ? "default" : "outline"} onClick={() => setVisualizacao("mes")}>Mês</Button>
            <Button variant={visualizacao === "semana" ? "default" : "outline"} onClick={() => setVisualizacao("semana")}>Semana</Button>
            <Button variant={visualizacao === "lista" ? "default" : "outline"} onClick={() => setVisualizacao("lista")}>
              <List className="mr-2 h-4 w-4" /> Lista
            </Button>
          </div>

          {visualizacao !== "lista" && (
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={mesAnterior}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span className="font-semibold min-w-[150px] text-center">
                {dataAtual.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
              </span>
              <Button variant="ghost" size="icon" onClick={proximoMes}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* VISUALIZAÇÃO MÊS */}
      {visualizacao === "mes" && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-7 gap-2">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => (
                <div key={d} className="text-center font-semibold text-sm text-muted-foreground p-2">{d}</div>
              ))}

              {getDiasDoMes().map((dia, index) => {
                if (!dia) return <div key={"empty-" + index} className="aspect-square" />;

                const consultasDia = consultasDoDia(dia);
                const isHoje = dia.toDateString() === new Date().toDateString();

                return (
                  <button
                    key={dia.toISOString()}
                    className={`aspect-square p-2 rounded-lg border text-left
                      ${isHoje ? "bg-primary/10 border-primary" : "hover:bg-muted"}`}
                    onClick={() => consultasDia[0] && setConsultaSelecionada(consultasDia[0])}
                  >
                    <div className="text-sm font-medium mb-1">{dia.getDate()}</div>

                    {consultasDia.slice(0,2).map(c => (
                      <div key={c.id} className="text-xs truncate bg-primary/20 px-1 rounded">
                        {c.hora}
                      </div>
                    ))}

                    {consultasDia.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{consultasDia.length - 2} mais
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* VISUALIZAÇÃO LISTA */}
      {visualizacao === "lista" && (
        <div className="space-y-3">
          {consultasMock.map((c) => (
            <Card
              key={c.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setConsultaSelecionada(c)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getStatusColor(c.status)}>{c.status}</Badge>
                  </div>

                  <div className="text-sm text-muted-foreground flex gap-4">
                    <span>📅 {new Date(c.data).toLocaleDateString("pt-BR")}</span>
                    <span>🕒 {c.hora}</span>
                    <span>📍 {c.local === "online" ? "Online" : "Presencial"}</span>
                  </div>
                </div>

                <Button variant="outline">Ver Detalhes</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL DE DETALHES */}
      {consultaSelecionada && (
        <Dialog open={!!consultaSelecionada} onOpenChange={() => setConsultaSelecionada(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalhes da Consulta</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Data</label>
                  <input className="w-full p-2 border rounded-md bg-background" disabled value={consultaSelecionada.data} />
                </div>
                <div>
                  <label className="text-sm font-medium">Hora</label>
                  <input className="w-full p-2 border rounded-md bg-background" disabled value={consultaSelecionada.hora} />
                </div>
                <div>
                  <label className="text-sm font-medium">Local</label>
                  <input className="w-full p-2 border rounded-md bg-background" disabled value={consultaSelecionada.local} />
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <input className="w-full p-2 border rounded-md bg-background" disabled value={consultaSelecionada.status} />
                </div>
                <div>
                  <label className="text-sm font-medium">Valor da Consulta</label>
                  <input className="w-full p-2 border rounded-md bg-background" disabled value={`R$ ${consultaSelecionada.valor}`} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Observações</label>
                <Textarea className="bg-background" disabled value={consultaSelecionada.observacoes || "Nenhuma observação."} />
              </div>

            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

