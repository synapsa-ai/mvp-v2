import { useState, useMemo, useRef } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  List,
  Video,
  Send
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { useApp } from '@/professionals/context/AppContext';
import { Consulta } from '@/professionals/types';
import { toast } from '@/hooks/use-toast';
import { gerarWhatsApp } from '@/professionals/lib/comunicacao';


// -----------------------------------------------
// CONFIG AGENDAS
// -----------------------------------------------

const getDiasDoMes = (dataAtual: Date) => {
  const ano = dataAtual.getFullYear();
  const mes = dataAtual.getMonth();
  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  const dias: (Date | null)[] = [];

  const vazio = primeiroDia.getDay() === 0 ? 6 : primeiroDia.getDay() - 1;
  for (let i = 0; i < vazio; i++) dias.push(null);

  for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
    dias.push(new Date(ano, mes, dia));
  }

  return dias;
};


export const Agenda = () => {
  const {
    consultas,
    updateConsultas,
    pacientes,
    recebimentos,
    updateRecebimentos
  } = useApp();

  const [visualizacao, setVisualizacao] = useState<'mes' | 'lista'>('mes');
  const [dataAtual, setDataAtual] = useState(new Date());

  const [modalNovaConsulta, setModalNovaConsulta] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState<Consulta | null>(null);

  const dragInfo = useRef<{ consulta: Consulta | null }>({ consulta: null });


  // -----------------------------------------------
  // NAVEGAÇÃO
  // -----------------------------------------------

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

  const hoje = () => {
    setDataAtual(new Date());
  };

  // -----------------------------------------------
  // UTILIDADES
  // -----------------------------------------------

  const consultasDoDia = (dia: Date) => {
    const dataStr = dia.toISOString().split("T")[0];
    return consultas.filter(c => c.data === dataStr);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-500/20 text-green-700';
      case 'cancelado':
        return 'bg-red-500/20 text-red-700';
      case 'reagendado':
        return 'bg-blue-500/20 text-blue-700';
      case 'concluido':
        return 'bg-gray-700 text-white';
      default:
        return 'bg-muted';
    }
  };


  // -----------------------------------------------
  // MODAL: CRIAR NOVA CONSULTA
  // -----------------------------------------------

  const [pacienteIdNovo, setPacienteIdNovo] = useState("");
  const [dataNova, setDataNova] = useState("");
  const [horaNova, setHoraNova] = useState("");
  const [duracaoNova, setDuracaoNova] = useState(60);
  const [localNovo, setLocalNovo] = useState<"presencial" | "online">("presencial");

  const handleCriarConsulta = () => {
    if (!pacienteIdNovo || !dataNova || !horaNova) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione paciente, data e horário.",
        variant: "destructive"
      });
      return;
    }

    const paciente = pacientes.find(p => p.id === pacienteIdNovo);
    if (!paciente) return;

    const novaConsulta: Consulta = {
      id: Date.now().toString(),
      pacienteId: paciente.id,
      pacienteNome: paciente.nome,
      data: dataNova,
      hora: horaNova,
      duracao: duracaoNova,
      local: localNovo,
      status: "confirmado"
    };

    updateConsultas([...consultas, novaConsulta]);
    toast({ title: "✓ Consulta criada" });

    setModalNovaConsulta(false);
    setPacienteIdNovo("");
    setDataNova("");
    setHoraNova("");
    setDuracaoNova(60);
  };
// -----------------------------------------------
// MODAL — DETALHES DA CONSULTA
// -----------------------------------------------

const handleStatusChange = (consulta: Consulta, novo: string) => {
  const updated = consultas.map(c => c.id === consulta.id ? { ...c, status: novo } : c);
  updateConsultas(updated);
  setConsultaSelecionada({ ...consulta, status: novo });
};

const handleDataChange = (consulta: Consulta, novaData: string) => {
  const updated = consultas.map(c => c.id === consulta.id ? { ...c, data: novaData } : c);
  updateConsultas(updated);
  setConsultaSelecionada({ ...consulta, data: novaData });
};

const handleHoraChange = (consulta: Consulta, novaHora: string) => {
  const updated = consultas.map(c => c.id === consulta.id ? { ...c, hora: novaHora } : c);
  updateConsultas(updated);
  setConsultaSelecionada({ ...consulta, hora: novaHora });
};

const handleLocalChange = (consulta: Consulta, novo: string) => {
  const updated = consultas.map(c => c.id === consulta.id ? { ...c, local: novo } : c);
  updateConsultas(updated);
  setConsultaSelecionada({ ...consulta, local: novo });
};

const handleDuracaoChange = (consulta: Consulta, valor: number) => {
  const updated = consultas.map(c => c.id === consulta.id ? { ...c, duracao: valor } : c);
  updateConsultas(updated);
  setConsultaSelecionada({ ...consulta, duracao: valor });
};

const handleGerarResumoIA = (consulta: Consulta) => {
  const resumo = `Resumo da consulta de ${consulta.pacienteNome}:\n\n- Data: ${consulta.data}\n- Hora: ${consulta.hora}\n- Local: ${consulta.local}\n- Duração: ${consulta.duracao} min\n`;

  const updated = consultas.map(c => c.id === consulta.id ? { ...c, resumoIA: resumo } : c);
  updateConsultas(updated);

  setConsultaSelecionada({ ...consulta, resumoIA: resumo });

  toast({ title: "Resumo criado via IA" });
};

// -----------------------------------------------
// RENDERIZAÇÃO: VISÃO MENSAL
// -----------------------------------------------

const renderAgendaMensal = () => {
  const dias = getDiasDoMes(dataAtual);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-7 gap-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
            <div key={dia} className="text-center text-sm font-semibold text-muted-foreground">
              {dia}
            </div>
          ))}

          {dias.map((dia, index) => {
            if (!dia) return <div key={index} className="aspect-square" />;

            const dataStr = dia.toISOString().split("T")[0];
            const consultasDia = consultas.filter(c => c.data === dataStr);
            const isHoje = dia.toDateString() === new Date().toDateString();

            return (
              <button
                key={dataStr}
                onClick={() => {
                  const primeira = consultasDia[0];
                  if (primeira) setConsultaSelecionada(primeira);
                }}
                className={`aspect-square p-2 rounded-lg border text-left transition-colors ${
                  isHoje ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                }`}
              >
                <div className="text-sm font-medium">{dia.getDate()}</div>

                {consultasDia.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {consultasDia.slice(0, 2).map(c => (
                      <div key={c.id} className="text-xs truncate bg-primary/20 px-1 rounded">
                        {c.hora} — {c.pacienteNome}
                      </div>
                    ))}

                    {consultasDia.length > 2 && (
                      <div className="text-[11px] text-muted-foreground">
                        +{consultasDia.length - 2} mais
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};


// -----------------------------------------------
// VISÃO EM LISTA
// -----------------------------------------------

const renderAgendaLista = () => {
  if (consultas.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-16 flex flex-col items-center justify-center">
          <CalendarIcon className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold">Nenhuma consulta agendada</h3>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {consultas.map((consulta) => (
        <Card
          key={consulta.id}
          className="cursor-pointer hover:shadow-md transition"
          onClick={() => setConsultaSelecionada(consulta)}
        >
          <CardContent className="p-4 flex justify-between">
            <div>
              <h3 className="font-semibold text-lg">{consulta.pacienteNome}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(consulta.data).toLocaleDateString('pt-BR')} — {consulta.hora}
              </p>
            </div>
            <Badge className={getStatusColor(consulta.status)}>{consulta.status}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
// -----------------------------------------------
// RENDER FINAL DO COMPONENTE
// -----------------------------------------------

return (
  <div className="p-6 space-y-6">

    {/* HEADER */}
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Agenda</h1>
        <p className="text-muted-foreground">
          {consultas.length} consulta{consultas.length !== 1 ? 's' : ''} agendada{consultas.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => setModalNovaConsulta(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Consulta
        </Button>
      </div>
    </div>


    {/* CONTROLES */}
    <Card>
      <CardContent className="pt-6 flex items-center justify-between">

        <div className="flex gap-2">
          <Button
            variant={visualizacao === 'mes' ? 'default' : 'outline'}
            onClick={() => setVisualizacao('mes')}
          >
            Mês
          </Button>

          <Button
            variant={visualizacao === 'lista' ? 'default' : 'outline'}
            onClick={() => setVisualizacao('lista')}
          >
            <List className="mr-2 h-4 w-4" />
            Lista
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={mesAnterior}>
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <span className="font-semibold min-w-[150px] text-center">
            {dataAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </span>

          <Button variant="ghost" size="icon" onClick={proximoMes}>
            <ChevronRight className="w-5 h-5" />
          </Button>

          <Button variant="outline" onClick={hoje}>Hoje</Button>
        </div>

      </CardContent>
    </Card>


    {/* RENDERIZAÇÕES */}
    {visualizacao === 'mes' && renderAgendaMensal()}
    {visualizacao === 'lista' && renderAgendaLista()}


    {/* MODAL: NOVA CONSULTA */}
    <Dialog open={modalNovaConsulta} onOpenChange={setModalNovaConsulta}>
      <DialogContent className="max-w-md">

        <DialogHeader>
          <DialogTitle>Agendar Nova Consulta</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">

          {/* Paciente */}
          <div>
            <label className="text-sm font-medium">Paciente *</label>
            <select
              className="w-full p-2 border rounded-md bg-background"
              value={pacienteIdNovo}
              onChange={(e) => setPacienteIdNovo(e.target.value)}
            >
              <option value="">Selecione...</option>
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div>
            <label className="text-sm font-medium">Data *</label>
            <Input
              type="date"
              value={dataNova}
              onChange={(e) => setDataNova(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Hora */}
          <div>
            <label className="text-sm font-medium">Hora *</label>
            <Input
              type="time"
              value={horaNova}
              onChange={(e) => setHoraNova(e.target.value)}
            />
          </div>

          {/* Duração */}
          <div>
            <label className="text-sm font-medium">Duração (min)</label>
            <select
              className="w-full p-2 border rounded-md bg-background"
              value={duracaoNova}
              onChange={(e) => setDuracaoNova(Number(e.target.value))}
            >
              <option value={60}>60 min</option>
              <option value={50}>50 min</option>
              <option value={45}>45 min</option>
              <option value={30}>30 min</option>
            </select>
          </div>

          {/* Local */}
          <div>
            <label className="text-sm font-medium">Local</label>
            <select
              className="w-full p-2 border rounded-md bg-background"
              value={localNovo}
              onChange={(e) => setLocalNovo(e.target.value as any)}
            >
              <option value="presencial">Presencial</option>
              <option value="online">Online</option>
            </select>
          </div>

          <Button className="w-full" onClick={handleCriarConsulta}>
            Criar Consulta
          </Button>

        </div>
      </DialogContent>
    </Dialog>


    {/* MODAL: DETALHES CONSULTA */}
    {consultaSelecionada && (
      <Dialog open={!!consultaSelecionada} onOpenChange={() => setConsultaSelecionada(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">

          <DialogHeader>
            <DialogTitle>Detalhes da Consulta</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="info">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="comunicacao">Comunic.</TabsTrigger>
              <TabsTrigger value="reagendar">Reagendar</TabsTrigger>
              <TabsTrigger value="resumo">Resumo IA</TabsTrigger>
            </TabsList>

            {/* INFO */}
            <TabsContent value="info" className="space-y-4 mt-4">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Paciente</label>
                  <Input disabled value={consultaSelecionada.pacienteNome} />
                </div>

                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={consultaSelecionada.status}
                    onChange={(e) => handleStatusChange(consultaSelecionada, e.target.value)}
                  >
                    <option value="confirmado">Confirmado</option>
                    <option value="reagendado">Reagendado</option>
                    <option value="cancelado">Cancelado</option>
                    <option value="em_andamento">Em andamento</option>
                    <option value="concluido">Concluído</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Data</label>
                  <Input
                    type="date"
                    value={consultaSelecionada.data}
                    onChange={(e) => handleDataChange(consultaSelecionada, e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Hora</label>
                  <Input
                    type="time"
                    value={consultaSelecionada.hora}
                    onChange={(e) => handleHoraChange(consultaSelecionada, e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Local</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={consultaSelecionada.local}
                    onChange={(e) => handleLocalChange(consultaSelecionada, e.target.value)}
                  >
                    <option value="presencial">Presencial</option>
                    <option value="online">Online</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Duração</label>
                  <Input
                    type="number"
                    value={consultaSelecionada.duracao}
                    onChange={(e) =>
                      handleDuracaoChange(consultaSelecionada, Number(e.target.value))
                    }
                  />
                </div>
              </div>
            </TabsContent>


            {/* COMUNICAÇÃO */}
            <TabsContent value="comunicacao" className="space-y-4 mt-4">
              <label className="text-sm font-medium">Mensagem WhatsApp</label>
              <Textarea id="msgManual" placeholder="Digite a mensagem..." />

              <Button
                className="w-full"
                onClick={() => {
                  const paciente = pacientes.find(p => p.id === consultaSelecionada.pacienteId);
                  const texto = (document.getElementById("msgManual") as HTMLTextAreaElement).value;
                  if (paciente && texto) gerarWhatsApp(paciente.telefone, texto);
                }}
              >
                <Send className="mr-2 h-4 w-4" />
                Enviar
              </Button>
            </TabsContent>


            {/* REAGENDAR */}
            <TabsContent value="reagendar" className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Escolha nova data e horário:
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nova Data</label>
                  <Input type="date" id="novaData" defaultValue={consultaSelecionada.data} />
                </div>
                <div>
                  <label className="text-sm font-medium">Novo Horário</label>
                  <Input type="time" id="novaHora" defaultValue={consultaSelecionada.hora} />
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  const nd = (document.getElementById("novaData") as HTMLInputElement).value;
                  const nh = (document.getElementById("novaHora") as HTMLInputElement).value;
                  if (!nd || !nh) return;
                  handleDataChange(consultaSelecionada, nd);
                  handleHoraChange(consultaSelecionada, nh);
                }}
              >
                Confirmar Reagendamento
              </Button>
            </TabsContent>


            {/* RESUMO IA */}
            <TabsContent value="resumo" className="space-y-4 mt-4">
              {consultaSelecionada.resumoIA ? (
                <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap text-sm">
                  {consultaSelecionada.resumoIA}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  Nenhum resumo gerado
                </p>
              )}

              <Button className="w-full" onClick={() => handleGerarResumoIA(consultaSelecionada)}>
                Gerar Resumo Automático
              </Button>
            </TabsContent>
          </Tabs>

        </DialogContent>
      </Dialog>
    )}

  </div>
);
};
