import { useState, useRef } from "react";
import { Send, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chat } from "@/lib/api";

interface Mensagem {
  id: string;
  tipo: "usuario" | "assistente";
  conteudo: string;
  timestamp: string;
}

interface ChatLyraProps {
  placeholder?: string;
  sugestoesRapidas: { texto: string; label: string }[];
}

const ChatLyra = ({
  placeholder = "Digite sua mensagem...",
  sugestoesRapidas,
}: ChatLyraProps) => {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: "1",
      tipo: "assistente",
      conteudo:
        "Olá! Eu sou a Lyra, assistente de monitoramento emocional. Posso ajudar com:\n\n• Resumo de humor de pacientes\n• Identificação de sinais de risco\n\nComo posso apoiar você e seus pacientes agora?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);

  // thread_id estável para o médico nessa aba
  const sessionRef = useRef<string>(`doctor:${crypto.randomUUID()}`);

  const handleEnviar = async () => {
    if (!input.trim() || carregando) return;

    const textoUsuario = input;

    const novaMensagem: Mensagem = {
      id: Date.now().toString(),
      tipo: "usuario",
      conteudo: textoUsuario,
      timestamp: new Date().toISOString(),
    };

    setMensagens((prev) => [...prev, novaMensagem]);
    setInput("");
    setCarregando(true);

    try {
      const sessionId = sessionRef.current;

      // 👇 chamada real ao agente doctor
      const resposta = await chat("doctor", sessionId, textoUsuario);

      let textoAssistente = resposta.reply_text?.toString().trim() || "";

      if (!textoAssistente) {
        textoAssistente =
          "Não consegui obter uma resposta válida do agente no momento.";
      }

      const respostaIA: Mensagem = {
        id: (Date.now() + 1).toString(),
        tipo: "assistente",
        conteudo: textoAssistente,
        timestamp: new Date().toISOString(),
      };

      setMensagens((prev) => [...prev, respostaIA]);
    } catch (err: any) {
      const erroMsg: Mensagem = {
        id: (Date.now() + 2).toString(),
        tipo: "assistente",
        conteudo:
          "Ocorreu um erro ao falar com a Lyra (agente doctor).\n" +
          (err?.message ? `Detalhes: ${err.message}` : ""),
        timestamp: new Date().toISOString(),
      };
      setMensagens((prev) => [...prev, erroMsg]);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Card className="flex-1 flex flex-col min-h-[500px]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {mensagens.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.tipo === "usuario" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.tipo === "assistente" && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.tipo === "usuario"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.conteudo}</p>
                <p className="text-xs opacity-60 mt-2">
                  {new Date(msg.timestamp).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {msg.tipo === "usuario" && (
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
            onKeyDown={(e) => e.key === "Enter" && handleEnviar()}
            disabled={carregando}
          />
          <Button
            onClick={handleEnviar}
            disabled={carregando || !input.trim()}
          >
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
              disabled={carregando}
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
      <h1 className="text-4xl font-bold mb-6 text-center">Lyra</h1>

      <div className="w-full max-w-5xl flex-1 flex">
        <ChatLyra
          placeholder="Pergunte sobre humor, risco emocional ou mensagens acolhedoras..."
          sugestoesRapidas={[
            {
              label: "Resumo de humor",
              texto:
                "Analise os registros de humor dos meus pacientes nos últimos 30 dias.",
            },
            {
              label: "Sinais de alerta",
              texto:
                "Quais sinais recentes indicam maior risco emocional entre meus pacientes?",
            },
          ]}
        />
      </div>
    </div>
  );
};
