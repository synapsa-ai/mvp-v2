import { useState } from 'react';
import { MessageSquare, Send, Edit, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/professionals/context/AppContext';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { gerarWhatsApp, substituirVariaveis } from '@/professionals/lib/comunicacao';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const Mensagens = () => {
  const { mensagensPadrao, updateMensagensPadrao, pacientes, consultas } = useApp();
  const [mensagemEditando, setMensagemEditando] = useState<string | null>(null);
  const [modalEnvioMassa, setModalEnvioMassa] = useState(false);
  const [dataAlvo, setDataAlvo] = useState('');
  const [canalSelecionado, setCanalSelecionado] = useState<'whatsapp' | 'email'>('whatsapp');

  const handleEnvioEmMassa = () => {
    if (!dataAlvo) {
      toast({ title: 'Atenção', description: 'Selecione uma data', variant: 'destructive' });
      return;
    }

    const consultasDaData = consultas.filter(c => c.data === dataAlvo);
    if (consultasDaData.length === 0) {
      toast({ title: 'Nenhuma consulta encontrada para esta data', variant: 'destructive' });
      return;
    }

    const mensagemPadrao = mensagensPadrao.find(m => m.tipo === 'lembrete');
    let contador = 0;

    consultasDaData.forEach((consulta, i) => {
      const paciente = pacientes.find(p => p.id === consulta.pacienteId);
      if (paciente && paciente.telefone) {
        setTimeout(() => {
          const texto = mensagemPadrao
            ? substituirVariaveis(mensagemPadrao.conteudo, {
                data: new Date(consulta.data).toLocaleDateString('pt-BR'),
                hora: consulta.hora,
                paciente: paciente.nome
              })
            : `Olá ${paciente.nome}, lembramos da sua consulta em ${new Date(consulta.data).toLocaleDateString('pt-BR')} às ${consulta.hora}.`;
          
          gerarWhatsApp(paciente.telefone, texto);
          contador++;
        }, i * 1500);
      }
    });

    toast({ title: `✓ Enviando ${consultasDaData.length} lembretes...` });
    setModalEnvioMassa(false);
  };

  const handleNovaMensagem = () => {
    const nova = {
      id: Date.now().toString(),
      nome: 'Nova Mensagem',
      tipo: 'custom' as const,
      conteudo: 'Digite sua mensagem aqui...'
    };
    updateMensagensPadrao([...mensagensPadrao, nova]);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mensagens</h1>
          <p className="text-muted-foreground">
            Configure mensagens padrão e envie lembretes
          </p>
        </div>
        <Button onClick={handleNovaMensagem}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Mensagem
        </Button>
        <Button onClick={() => setModalEnvioMassa(true)} variant="outline">
          <Users className="mr-2 h-4 w-4" />
          Envio em Massa
        </Button>
      </div>

      {/* Mensagens Padrão */}
      <div className="grid md:grid-cols-2 gap-4">
        {mensagensPadrao.map((msg) => (
          <Card key={msg.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{msg.nome}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMensagemEditando(mensagemEditando === msg.id ? null : msg.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mensagemEditando === msg.id ? (
                <>
                  <Input
                    value={msg.nome}
                    onChange={(e) => {
                      const updated = mensagensPadrao.map(m =>
                        m.id === msg.id ? { ...m, nome: e.target.value } : m
                      );
                      updateMensagensPadrao(updated);
                    }}
                    placeholder="Nome da mensagem"
                  />
                  <textarea
                    className="w-full min-h-[120px] p-3 border rounded-md bg-background"
                    value={msg.conteudo}
                    onChange={(e) => {
                      const updated = mensagensPadrao.map(m =>
                        m.id === msg.id ? { ...m, conteudo: e.target.value } : m
                      );
                      updateMensagensPadrao(updated);
                    }}
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setMensagemEditando(null)}
                  >
                    Salvar
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {msg.conteudo}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Variáveis disponíveis: {'{'}{'{'} data {'}'}{'}'}, {'{'}{'{'} hora {'}'}{'}'}, {'{'}{'{'} paciente {'}'}{'}'} 
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Envio em Massa */}
      <Dialog open={modalEnvioMassa} onOpenChange={setModalEnvioMassa}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envio de Lembretes em Massa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Selecione uma data para enviar lembretes a todos os pacientes com consultas agendadas
            </p>
            
            <div>
              <label className="text-sm font-medium">Data das Consultas</label>
              <Input
                type="date"
                value={dataAlvo}
                onChange={(e) => setDataAlvo(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Canal</label>
              <div className="flex gap-2 mt-1">
                <Button
                  variant={canalSelecionado === 'whatsapp' ? 'default' : 'outline'}
                  onClick={() => setCanalSelecionado('whatsapp')}
                  className="flex-1"
                >
                  WhatsApp
                </Button>
                <Button
                  variant={canalSelecionado === 'email' ? 'default' : 'outline'}
                  onClick={() => setCanalSelecionado('email')}
                  className="flex-1"
                  disabled
                >
                  E-mail (em breve)
                </Button>
              </div>
            </div>

            {dataAlvo && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">
                  {consultas.filter(c => c.data === dataAlvo).length} consulta(s) encontrada(s) para esta data
                </p>
              </div>
            )}

            <Button onClick={handleEnvioEmMassa} className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Enviar Lembretes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Envio Individual */}
      <Card>
        <CardHeader>
          <CardTitle>Envio Individual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Selecione uma mensagem padrão e um paciente para envio individual
          </p>
          
          <div>
            <label className="text-sm font-medium">Mensagem Padrão</label>
            <select className="w-full p-2 border rounded-md bg-background mt-1" id="msg-individual">
              {mensagensPadrao.map(msg => (
                <option key={msg.id} value={msg.id}>{msg.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Paciente</label>
            <select className="w-full p-2 border rounded-md bg-background mt-1" id="pac-individual">
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>{p.nome} - {p.telefone || 'Sem telefone'}</option>
              ))}
            </select>
          </div>

          {pacientes.length > 0 && (
            <Button
              className="w-full"
              onClick={() => {
                const msgId = (document.getElementById('msg-individual') as HTMLSelectElement).value;
                const pacId = (document.getElementById('pac-individual') as HTMLSelectElement).value;
                const msg = mensagensPadrao.find(m => m.id === msgId);
                const pac = pacientes.find(p => p.id === pacId);
                
                if (msg && pac && pac.telefone) {
                  const texto = substituirVariaveis(msg.conteudo, {
                    paciente: pac.nome,
                    data: new Date().toLocaleDateString('pt-BR'),
                    hora: '00:00'
                  });
                  gerarWhatsApp(pac.telefone, texto);
                  toast({ title: '✓ Mensagem enviada' });
                }
              }}
            >
              <Send className="mr-2 h-4 w-4" />
              Enviar
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Histórico */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Envios</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Os envios realizados aparecerão no prontuário de cada paciente
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
