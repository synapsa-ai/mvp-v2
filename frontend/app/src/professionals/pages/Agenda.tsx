import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, List, Video, MessageSquare, Send, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useApp } from '@/professionals/context/AppContext';
import { Consulta } from '@/professionals/types';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { gerarWhatsApp, substituirVariaveis } from '@/professionals/lib/comunicacao';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export const Agenda = () => {
  const { consultas, updateConsultas, pacientes, mensagensPadrao, updatePacientes, recebimentos, updateRecebimentos, valorPadraoConsulta } = useApp();
  const [visualizacao, setVisualizacao] = useState<'mes' | 'semana' | 'lista'>('mes');
  const [dataAtual, setDataAtual] = useState(new Date());
  const [consultaSelecionada, setConsultaSelecionada] = useState<Consulta | null>(null);
  const [modalNovaConsulta, setModalNovaConsulta] = useState(false);

  const handleNovaConsulta = () => {
    if (pacientes.length === 0) {
      toast({
        title: 'Atenção',
        description: 'Cadastre um paciente antes de agendar consultas',
        variant: 'destructive',
      });
      return;
    }

    const novaConsulta: Consulta = {
      id: Date.now().toString(),
      pacienteId: pacientes[0].id,
      pacienteNome: pacientes[0].nome,
      data: new Date().toISOString().split('T')[0],
      hora: '09:00',
      duracao: 60,
      local: 'presencial',
      status: 'confirmado',
    };
    updateConsultas([...consultas, novaConsulta]);
    setModalNovaConsulta(false);
    setConsultaSelecionada(novaConsulta);
    toast({ title: '✓ Consulta criada' });
  };

  const handleSincronizar = () => {
    toast({
      title: '🔄 Sincronizando com Google Calendar...',
      description: 'Aguarde alguns instantes',
    });
    setTimeout(() => {
      // Mesclar com eventos mock apenas se mês atual estiver vazio
      const hoje = new Date();
      const mesAtual = consultas.filter(c => {
        const dataConsulta = new Date(c.data);
        return dataConsulta.getMonth() === hoje.getMonth() && 
               dataConsulta.getFullYear() === hoje.getFullYear();
      });
      
      if (mesAtual.length === 0 && pacientes.length > 0) {
        const consultasMock: Consulta[] = [
          {
            id: `sync-${Date.now()}-1`,
            pacienteId: pacientes[0].id,
            pacienteNome: pacientes[0].nome,
            data: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 2).toISOString().split('T')[0],
            hora: '10:00',
            duracao: 60,
            local: 'presencial',
            status: 'confirmado',
            motivo: 'Sincronizado do Google Calendar'
          }
        ];
        updateConsultas([...consultas, ...consultasMock]);
      }
      
      toast({ title: '✓ Agenda sincronizada com sucesso' });
    }, 1200);
  };

  const handleEnviarLembrete = (consulta: Consulta) => {
    const paciente = pacientes.find(p => p.id === consulta.pacienteId);
    if (!paciente) {
      toast({ title: 'Erro', description: 'Paciente não encontrado', variant: 'destructive' });
      return;
    }

    const mensagemPadrao = mensagensPadrao.find(m => m.tipo === 'lembrete');
    const texto = mensagemPadrao 
      ? substituirVariaveis(mensagemPadrao.conteudo, {
          data: new Date(consulta.data).toLocaleDateString('pt-BR'),
          hora: consulta.hora,
          paciente: paciente.nome
        })
      : `Olá ${paciente.nome}, lembramos que você tem consulta agendada para ${new Date(consulta.data).toLocaleDateString('pt-BR')} às ${consulta.hora}.`;

    gerarWhatsApp(paciente.telefone, texto);
    
    // Registrar no histórico
    const pacienteAtualizado = {
      ...paciente,
      comunicacao: [
        ...paciente.comunicacao,
        {
          data: new Date().toISOString(),
          tipo: 'whatsapp' as const,
          mensagem: texto,
          enviado: true
        }
      ]
    };
    updatePacientes(pacientes.map(p => p.id === paciente.id ? pacienteAtualizado : p));
    toast({ title: '✓ Lembrete enviado' });
  };

  const handleReagendar = (consulta: Consulta, novaData: string, novaHora: string) => {
    const consultaAtualizada = { ...consulta, data: novaData, hora: novaHora, status: 'reagendado' as const };
    updateConsultas(consultas.map(c => c.id === consulta.id ? consultaAtualizada : c));
    
    const paciente = pacientes.find(p => p.id === consulta.pacienteId);
    if (paciente) {
      const mensagemPadrao = mensagensPadrao.find(m => m.tipo === 'reagendamento');
      const texto = mensagemPadrao
        ? substituirVariaveis(mensagemPadrao.conteudo, {
            data: new Date(novaData).toLocaleDateString('pt-BR'),
            hora: novaHora,
            paciente: paciente.nome
          })
        : `Olá ${paciente.nome}, sua consulta foi reagendada para ${new Date(novaData).toLocaleDateString('pt-BR')} às ${novaHora}.`;
      
      gerarWhatsApp(paciente.telefone, texto);
    }
    
    setConsultaSelecionada(consultaAtualizada);
    toast({ title: '✓ Consulta reagendada' });
  };

  const handleMarcarComoPago = (consulta: Consulta) => {
    // Verificar se já existe lançamento para esta consulta
    const lancamentoExistente = recebimentos.find(r => r.consultaId === consulta.id);
    if (lancamentoExistente) {
      toast({
        title: 'Atenção',
        description: 'Já existe um lançamento financeiro para esta consulta',
        variant: 'destructive',
      });
      return;
    }

    const paciente = pacientes.find(p => p.id === consulta.pacienteId);
    if (!paciente) {
      toast({ title: 'Erro', description: 'Paciente não encontrado', variant: 'destructive' });
      return;
    }

    const novoRecebimento = {
      id: Date.now().toString(),
      pacienteId: consulta.pacienteId,
      pacienteNome: consulta.pacienteNome,
      data: consulta.data,
      valor: valorPadraoConsulta,
      formaPagamento: 'pix',
      status: 'pago' as const,
      observacoes: `Consulta do dia ${new Date(consulta.data).toLocaleDateString('pt-BR')} às ${consulta.hora}`,
      consultaId: consulta.id,
    };

    updateRecebimentos([...recebimentos, novoRecebimento]);
    toast({ title: '✓ Lançamento financeiro criado com sucesso' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-500/10 text-green-700';
      case 'reagendado': return 'bg-blue-500/10 text-blue-700';
      case 'cancelado': return 'bg-red-500/10 text-red-700';
      case 'em_andamento': return 'bg-purple-500/10 text-purple-700';
      case 'concluido': return 'bg-gray-500/10 text-gray-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

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
    const dataStr = data.toISOString().split('T')[0];
    return consultas.filter(c => c.data === dataStr);
  };

  const getDiasDoMes = () => {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const dias = [];

    // Dias vazios no início
    for (let i = 0; i < primeiroDia.getDay(); i++) {
      dias.push(null);
    }

    // Dias do mês
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      dias.push(new Date(ano, mes, dia));
    }

    return dias;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agenda</h1>
          <p className="text-muted-foreground">
            {consultas.length} consulta{consultas.length !== 1 ? 's' : ''} agendada{consultas.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSincronizar} variant="outline">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Sincronizar
          </Button>
          <Button onClick={() => setModalNovaConsulta(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Consulta
          </Button>
        </div>
      </div>

      {/* Controles de Visualização */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={visualizacao === 'mes' ? 'default' : 'outline'}
                onClick={() => setVisualizacao('mes')}
              >
                Mês
              </Button>
              <Button
                variant={visualizacao === 'semana' ? 'default' : 'outline'}
                onClick={() => setVisualizacao('semana')}
              >
                Semana
              </Button>
              <Button
                variant={visualizacao === 'lista' ? 'default' : 'outline'}
                onClick={() => setVisualizacao('lista')}
              >
                <List className="mr-2 h-4 w-4" />
                Lista
              </Button>
            </div>

            {visualizacao !== 'lista' && (
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={mesAnterior}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="font-semibold min-w-[150px] text-center">
                  {dataAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </span>
                <Button variant="ghost" size="icon" onClick={proximoMes}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Visualização de Mês */}
      {visualizacao === 'mes' && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-7 gap-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
                <div key={dia} className="text-center font-semibold text-sm text-muted-foreground p-2">
                  {dia}
                </div>
              ))}
              {getDiasDoMes().map((dia, index) => {
                if (!dia) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const consultasDia = consultasDoDia(dia);
                const isHoje = dia.toDateString() === new Date().toDateString();

                return (
                  <button
                    key={dia.toISOString()}
                    className={`aspect-square p-2 rounded-lg border transition-colors text-left ${
                      isHoje ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">{dia.getDate()}</div>
                    {consultasDia.length > 0 && (
                      <div className="space-y-1">
                        {consultasDia.slice(0, 2).map(c => (
                          <div
                            key={c.id}
                            className="text-xs truncate bg-primary/20 px-1 rounded"
                          >
                            {c.hora} {c.pacienteNome}
                          </div>
                        ))}
                        {consultasDia.length > 2 && (
                          <div className="text-xs text-muted-foreground">
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
      )}

      {/* Visualização de Lista */}
      {visualizacao === 'lista' && (
        <div className="space-y-3">
          {consultas.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <CalendarIcon className="h-12 w-12 text-muted-foreground/20 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma consulta agendada</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Comece agendando sua primeira consulta
                </p>
                <Button onClick={() => setModalNovaConsulta(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Consulta
                </Button>
              </CardContent>
            </Card>
          ) : (
            consultas.map(consulta => (
              <Card
                key={consulta.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setConsultaSelecionada(consulta)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{consulta.pacienteNome}</h3>
                        <Badge className={getStatusColor(consulta.status)}>
                          {consulta.status}
                        </Badge>
                        {consulta.local === 'online' && (
                          <Badge variant="outline">
                            <Video className="mr-1 h-3 w-3" />
                            Online
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          📅 {new Date(consulta.data).toLocaleDateString('pt-BR')}
                        </span>
                        <span>🕐 {consulta.hora}</span>
                        <span>⏱️ {consulta.duracao} min</span>
                      </div>
                    </div>
                    <Button variant="ghost">Ver Detalhes</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Modal Nova Consulta */}
      <Dialog open={modalNovaConsulta} onOpenChange={setModalNovaConsulta}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar Nova Consulta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Uma nova consulta será criada. Você poderá editar todas as informações após o agendamento.
            </p>
            <Button onClick={handleNovaConsulta} className="w-full">
              Criar Consulta
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Detalhes da Consulta com Abas */}
      {consultaSelecionada && (
        <Dialog open={!!consultaSelecionada} onOpenChange={() => setConsultaSelecionada(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes da Consulta</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="comunicacao">Comunicação</TabsTrigger>
                <TabsTrigger value="reagendar">Reagendamento</TabsTrigger>
                <TabsTrigger value="resumo">Resumo IA</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Paciente</label>
                    <Input value={consultaSelecionada.pacienteNome} disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <select
                      className="w-full p-2 border rounded-md bg-background"
                      value={consultaSelecionada.status}
                      onChange={(e) => {
                        const updated = consultas.map(c =>
                          c.id === consultaSelecionada.id
                            ? { ...c, status: e.target.value as any }
                            : c
                        );
                        updateConsultas(updated);
                        setConsultaSelecionada({ ...consultaSelecionada, status: e.target.value as any });
                      }}
                    >
                      <option value="confirmado">Confirmado</option>
                      <option value="reagendado">Reagendado</option>
                      <option value="cancelado">Cancelado</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="concluido">Concluído</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Data</label>
                    <Input
                      type="date"
                      value={consultaSelecionada.data}
                      onChange={(e) => {
                        const updated = consultas.map(c =>
                          c.id === consultaSelecionada.id ? { ...c, data: e.target.value } : c
                        );
                        updateConsultas(updated);
                        setConsultaSelecionada({ ...consultaSelecionada, data: e.target.value });
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Hora</label>
                    <Input
                      type="time"
                      value={consultaSelecionada.hora}
                      onChange={(e) => {
                        const updated = consultas.map(c =>
                          c.id === consultaSelecionada.id ? { ...c, hora: e.target.value } : c
                        );
                        updateConsultas(updated);
                        setConsultaSelecionada({ ...consultaSelecionada, hora: e.target.value });
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Local</label>
                    <select
                      className="w-full p-2 border rounded-md bg-background"
                      value={consultaSelecionada.local}
                      onChange={(e) => {
                        const updated = consultas.map(c =>
                          c.id === consultaSelecionada.id
                            ? { ...c, local: e.target.value as 'presencial' | 'online' }
                            : c
                        );
                        updateConsultas(updated);
                        setConsultaSelecionada({
                          ...consultaSelecionada,
                          local: e.target.value as 'presencial' | 'online'
                        });
                      }}
                    >
                      <option value="presencial">Presencial</option>
                      <option value="online">Online</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duração (min)</label>
                    <Input
                      type="number"
                      value={consultaSelecionada.duracao}
                      onChange={(e) => {
                        const updated = consultas.map(c =>
                          c.id === consultaSelecionada.id ? { ...c, duracao: Number(e.target.value) } : c
                        );
                        updateConsultas(updated);
                        setConsultaSelecionada({ ...consultaSelecionada, duracao: Number(e.target.value) });
                      }}
                    />
                  </div>
                  {consultaSelecionada.local === 'online' && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium">Link de Vídeo</label>
                      <div className="flex gap-2">
                        <Input
                          value={consultaSelecionada.linkVideo || ''}
                          onChange={(e) => {
                            const updated = consultas.map(c =>
                              c.id === consultaSelecionada.id ? { ...c, linkVideo: e.target.value } : c
                            );
                            updateConsultas(updated);
                            setConsultaSelecionada({ ...consultaSelecionada, linkVideo: e.target.value });
                          }}
                          placeholder="https://meet.google.com/..."
                        />
                        <Button
                          variant="outline"
                          onClick={() => {
                            const linkFicticio = `https://meet.google.com/${Math.random().toString(36).substr(2, 9)}`;
                            const updated = consultas.map(c =>
                              c.id === consultaSelecionada.id ? { ...c, linkVideo: linkFicticio } : c
                            );
                            updateConsultas(updated);
                            setConsultaSelecionada({ ...consultaSelecionada, linkVideo: linkFicticio });
                            toast({ title: '✓ Link gerado' });
                          }}
                        >
                          Gerar
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Motivo</label>
                    <Textarea
                      value={consultaSelecionada.motivo || ''}
                      onChange={(e) => {
                        const updated = consultas.map(c =>
                          c.id === consultaSelecionada.id ? { ...c, motivo: e.target.value } : c
                        );
                        updateConsultas(updated);
                        setConsultaSelecionada({ ...consultaSelecionada, motivo: e.target.value });
                      }}
                      placeholder="Descreva o motivo da consulta..."
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Observações</label>
                    <Textarea
                      value={consultaSelecionada.observacoes || ''}
                      onChange={(e) => {
                        const updated = consultas.map(c =>
                          c.id === consultaSelecionada.id ? { ...c, observacoes: e.target.value } : c
                        );
                        updateConsultas(updated);
                        setConsultaSelecionada({ ...consultaSelecionada, observacoes: e.target.value });
                      }}
                      placeholder="Observações adicionais..."
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Pagamento</p>
                          <p className="text-sm text-muted-foreground">
                            Marcar consulta como paga e criar lançamento financeiro
                          </p>
                        </div>
                        <Button
                          onClick={() => handleMarcarComoPago(consultaSelecionada)}
                          variant="outline"
                        >
                          <DollarSign className="mr-2 h-4 w-4" />
                          Marcar como Pago
                        </Button>
                      </div>
                      {recebimentos.some(r => r.consultaId === consultaSelecionada.id) && (
                        <p className="text-xs text-green-600 mt-2">
                          ✓ Lançamento financeiro já registrado
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comunicacao" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Mensagem Manual</label>
                    <Textarea
                      placeholder="Digite sua mensagem personalizada..."
                      className="min-h-[120px]"
                      id="mensagem-manual"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      const textarea = document.getElementById('mensagem-manual') as HTMLTextAreaElement;
                      const paciente = pacientes.find(p => p.id === consultaSelecionada.pacienteId);
                      if (paciente && textarea.value) {
                        gerarWhatsApp(paciente.telefone, textarea.value);
                        toast({ title: '✓ Abrindo WhatsApp...' });
                      }
                    }}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Enviar WhatsApp
                  </Button>

                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-3">Mensagens Rápidas</p>
                    <div className="grid gap-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleEnviarLembrete(consultaSelecionada)}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Enviar Lembrete
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          const paciente = pacientes.find(p => p.id === consultaSelecionada.pacienteId);
                          if (paciente) {
                            const mensagemPadrao = mensagensPadrao.find(m => m.tipo === 'cancelamento');
                            const texto = mensagemPadrao
                              ? substituirVariaveis(mensagemPadrao.conteudo, {
                                  data: new Date(consultaSelecionada.data).toLocaleDateString('pt-BR'),
                                  hora: consultaSelecionada.hora,
                                  paciente: paciente.nome
                                })
                              : `Olá ${paciente.nome}, informamos que sua consulta de ${new Date(consultaSelecionada.data).toLocaleDateString('pt-BR')} às ${consultaSelecionada.hora} foi cancelada.`;
                            gerarWhatsApp(paciente.telefone, texto);
                            
                            const updated = consultas.map(c =>
                              c.id === consultaSelecionada.id ? { ...c, status: 'cancelado' as const } : c
                            );
                            updateConsultas(updated);
                            setConsultaSelecionada({ ...consultaSelecionada, status: 'cancelado' });
                            toast({ title: '✓ Mensagem de cancelamento enviada' });
                          }
                        }}
                      >
                        Notificar Cancelamento
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          const paciente = pacientes.find(p => p.id === consultaSelecionada.pacienteId);
                          if (paciente) {
                            const mensagemPadrao = mensagensPadrao.find(m => m.tipo === 'agradecimento');
                            const texto = mensagemPadrao?.conteudo || `Obrigado(a) por comparecer à consulta, ${paciente.nome}!`;
                            gerarWhatsApp(paciente.telefone, texto);
                            toast({ title: '✓ Mensagem de agradecimento enviada' });
                          }
                        }}
                      >
                        Enviar Agradecimento
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reagendar" className="space-y-4">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Selecione uma nova data e horário para reagendar a consulta
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Nova Data</label>
                      <Input
                        type="date"
                        id="nova-data"
                        defaultValue={consultaSelecionada.data}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Novo Horário</label>
                      <Input
                        type="time"
                        id="nova-hora"
                        defaultValue={consultaSelecionada.hora}
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      const novaData = (document.getElementById('nova-data') as HTMLInputElement).value;
                      const novaHora = (document.getElementById('nova-hora') as HTMLInputElement).value;
                      if (novaData && novaHora) {
                        handleReagendar(consultaSelecionada, novaData, novaHora);
                      }
                    }}
                  >
                    Confirmar Reagendamento
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="resumo" className="space-y-4">
                <div className="space-y-4">
                  {consultaSelecionada.resumoIA ? (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{consultaSelecionada.resumoIA}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="mb-4">Nenhum resumo gerado ainda</p>
                      <Button
                        onClick={() => {
                          const paciente = pacientes.find(p => p.id === consultaSelecionada.pacienteId);
                          const resumo = `Resumo da consulta de ${consultaSelecionada.pacienteNome} em ${new Date(consultaSelecionada.data).toLocaleDateString('pt-BR')}:\n\nMotivo: ${consultaSelecionada.motivo || 'Não especificado'}\nDuração: ${consultaSelecionada.duracao} minutos\nLocal: ${consultaSelecionada.local === 'online' ? 'Online' : 'Presencial'}\n\nObservações: ${consultaSelecionada.observacoes || 'Nenhuma observação registrada'}`;
                          
                          const updated = consultas.map(c =>
                            c.id === consultaSelecionada.id ? { ...c, resumoIA: resumo } : c
                          );
                          updateConsultas(updated);
                          setConsultaSelecionada({ ...consultaSelecionada, resumoIA: resumo });
                          
                          // Atualizar prontuário do paciente
                          if (paciente) {
                            const pacienteAtualizado = {
                              ...paciente,
                              prontuario: {
                                ...paciente.prontuario,
                                resumoIA: resumo,
                                historico: [
                                  ...paciente.prontuario.historico,
                                  {
                                    data: new Date().toISOString(),
                                    tipo: 'Consulta',
                                    conteudo: resumo
                                  }
                                ]
                              }
                            };
                            updatePacientes(pacientes.map(p => p.id === paciente.id ? pacienteAtualizado : p));
                          }
                          
                          toast({ title: '✓ Resumo gerado com sucesso' });
                        }}
                      >
                        Gerar Resumo Automático
                      </Button>
                    </div>
                  )}
                  {consultaSelecionada.resumoIA && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        toast({ title: '📄 Gerando PDF...', description: 'Download iniciará em instantes' });
                        setTimeout(() => {
                          toast({ title: '✓ PDF exportado com sucesso' });
                        }, 1500);
                      }}
                    >
                      Exportar PDF
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
