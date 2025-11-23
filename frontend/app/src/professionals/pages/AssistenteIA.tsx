import { useState } from 'react';
import { Send, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Mensagem {
  id: string;
  tipo: 'usuario' | 'assistente';
  conteudo: string;
  timestamp: string;
}

interface ChatLyraProps {
  placeholder?: string;
  sugestoesRapidas: { texto: string; label: string }[];
}

const ChatLyra = ({
  placeholder = 'Digite sua mensagem...',
  sugestoesRapidas,
}: ChatLyraProps) => {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: '1',
      tipo: 'assistente',
      conteudo:
        'Olá! Eu sou a Lyra, assistente de monitoramento emocional. Posso ajudar com:\n\n• Resumo de humor de pacientes\n• Identificação de sinais de risco\n\nComo posso apoiar você e seus pacientes agora?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [carregando, setCarregando] = useState(false);

  const gerarRespostaLyra = (): string => {
    const respostasLyra = [
      '💚 **Análise de Humor – Últimas 4 semanas (simulada)**\n\n• Predominância de humor: levemente ansioso\n• Picos de maior desconforto: domingos à noite e segundas de manhã\n• Registros de melhora após sessões com foco em psicoeducação e técnicas de respiração\n\nSugestão: manter intervenções focadas em manejo de ansiedade e propor um diário de pensamentos automáticos.',
      '📝 **Sugestão de Mensagem Acolhedora**\n\n"Olá! Estive pensando em como você tem se sentido nos últimos dias. Lembre-se de que não precisa enfrentar tudo isso sozinho(a). Se perceber que a carga está mais pesada, anote seus pensamentos e emoções para conversarmos na próxima sessão. Estou aqui para caminhar ao seu lado nesse processo."',
      '🚦 **Sinais de Atenção (simulação)**\n\nCom base nos registros de humor:\n\n• Aumento de relatos de cansaço extremo em 3 pacientes\n• 2 pacientes com queda na frequência de registros\n• 1 paciente com menção recorrente a sentimentos de desesperança\n\nSugestão: priorizar contato de follow-up com esses pacientes e explorar estratégias de rede de apoio na próxima sessão.',
    ];
    return respostasLyra[Math.floor(Math.random() * respostasLyra.length)];
  };

  const handleEnviar = () => {
    if (!input.trim()) return;

    const novaMensagem: Mensagem = {
      id: Date.now().toString(),
      tipo: 'usuario',
      conteudo: input,
      timestamp: new Date().toISOString(),
    };

    setMensagens((prev) => [...prev, novaMensagem]);
    setInput('');
    setCarregando(true);

    setTimeout(() => {
      const respostaIA: Mensagem = {
        id: (Date.now() + 1).toString(),
        tipo: 'assistente',
        conteudo: gerarRespostaLyra(),
        timestamp: new Date().toISOString(),
      };

      setMensagens((prev) => [...prev, respostaIA]);
      setCarregando(false);
    }, 1500);
  };

  return (
    <Card className="flex-1 flex flex-col min-h-[500px]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {mensagens.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'
              }`}
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

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleEnviar()}
            disabled={carregando}
          />
          <Button onClick={handleEnviar} disabled={carregando || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {sugestoesRapidas.map((sugestao) => (
            <Button
              key={sugestao.label}
              variant="outline"
              size="sm"
              onClick={() => setInput(sugestao.texto)}
            >
              <Sparkles className="mr-2 h-3 w-3" />
              {sugestao.label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export const AssistenteIA = () => {
  return (
    <div className="p-6 h-[calc(100vh-8rem)] flex flex-col items-center">
      {/* Título centralizado */}
      <h1 className="text-4xl font-bold mb-6 text-center">Lyra</h1>

      {/* Chat maior e centralizado */}
      <div className="w-full max-w-5xl flex-1 flex">
        <ChatLyra
          placeholder="Pergunte sobre humor, risco emocional ou mensagens acolhedoras..."
          sugestoesRapidas={[
            {
              label: 'Resumo de humor',
              texto: 'Analise os registros de humor dos meus pacientes nos últimos 30 dias.',
            },
            {
              label: 'Sinais de alerta',
              texto: 'Quais sinais recentes indicam maior risco emocional entre meus pacientes?',
            }
          ]}
        />
      </div>
    </div>
  );
};
