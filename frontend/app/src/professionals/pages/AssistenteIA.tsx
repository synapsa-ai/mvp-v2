import { useState } from 'react';
import { Send, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Mensagem {
  id: string;
  tipo: 'usuario' | 'assistente';
  conteudo: string;
  timestamp: string;
}

export const AssistenteIA = () => {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: '1',
      tipo: 'assistente',
      conteudo: 'Olá! Sou o Assistente IA do Synapsa CRM. Posso ajudar você com:\n\n• Gerar resumos pós-consulta\n• Sugerir mensagens empáticas\n• Montar agenda sugerida de retornos\n• Identificar tendências nos dados\n\nComo posso ajudar?',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleEnviar = () => {
    if (!input.trim()) return;

    const novaMensagem: Mensagem = {
      id: Date.now().toString(),
      tipo: 'usuario',
      conteudo: input,
      timestamp: new Date().toISOString(),
    };

    setMensagens(prev => [...prev, novaMensagem]);
    setInput('');
    setCarregando(true);

    // Simular resposta da IA
    setTimeout(() => {
      const respostas = [
        'Com base nas notas clínicas do paciente, sugiro o seguinte resumo:\n\n📝 **Resumo da Consulta**\n\nPaciente apresentou evolução positiva desde a última sessão. Foram trabalhados aspectos relacionados à ansiedade e estabelecidos objetivos terapêuticos para as próximas semanas.\n\n**Recomendações:**\n- Retorno em 7 dias\n- Prática de técnicas de respiração\n- Registro de humor diário',
        
        'Aqui está uma sugestão de mensagem empática para follow-up:\n\n💚 **Mensagem Sugerida:**\n\n"Olá! Espero que esteja se sentindo bem após nossa última conversa. Como têm sido seus dias? Estou à disposição caso precise conversar ou tenha alguma dúvida sobre o que trabalhamos na consulta. Você não está sozinho(a) nessa jornada."',
        
        '📊 **Insight de Tendências:**\n\nAnalisando seus dados dos últimos 3 meses, identifiquei:\n\n• Taxa de comparecimento: 85% (acima da média)\n• Pacientes mais engajados nas quintas-feiras\n• Maior demanda de agendamentos entre 14h-17h\n• 3 pacientes sem retorno há mais de 30 dias\n\nSugestão: Considere oferecer horários adicionais nas quintas-feiras.',
      ];

      const respostaAleatoria = respostas[Math.floor(Math.random() * respostas.length)];

      const respostaIA: Mensagem = {
        id: (Date.now() + 1).toString(),
        tipo: 'assistente',
        conteudo: respostaAleatoria,
        timestamp: new Date().toISOString(),
      };

      setMensagens(prev => [...prev, respostaIA]);
      setCarregando(false);
    }, 1500);
  };

  return (
    <div className="p-6 h-[calc(100vh-8rem)]">
      <div className="flex flex-col h-full max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Assistente IA</h1>
          <p className="text-muted-foreground">
            Copiloto administrativo para resumos e insights
          </p>
        </div>

        {/* Chat Container */}
        <Card className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {mensagens.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.tipo === 'assistente' && (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.tipo === 'usuario'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.conteudo}</p>
                    <p className="text-xs opacity-60 mt-2">
                      {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {msg.tipo === 'usuario' && (
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-white">V</span>
                    </div>
                  )}
                </div>
              ))}
              {carregando && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce delay-100" />
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleEnviar()}
                disabled={carregando}
              />
              <Button onClick={handleEnviar} disabled={carregando || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Sugestões Rápidas */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput('Gere um resumo pós-consulta')}
          >
            <Sparkles className="mr-2 h-3 w-3" />
            Gerar Resumo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput('Sugira uma mensagem de follow-up empática')}
          >
            <Sparkles className="mr-2 h-3 w-3" />
            Mensagem Empática
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput('Analise as tendências dos meus dados')}
          >
            <Sparkles className="mr-2 h-3 w-3" />
            Insights
          </Button>
        </div>
      </div>
    </div>
  );
};
