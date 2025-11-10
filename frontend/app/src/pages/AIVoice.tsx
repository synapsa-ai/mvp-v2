// frontend/app/src/pages/AIvoice.tsx
// frontend/app/src/pages/AIvoice.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { chat, transcribeWebm } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const horaCurta = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ChatVozPTBR = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Oi! Sou seu assistente. Toque no microfone para falar e eu transcrevo sua fala. Você também pode digitar abaixo.",
    },
  ]);
  const [input, setInput] = useState("");

  // >>>>>>> ADICIONE ISTO: um thread_id estável por aba <<<<<<<
  const sidRef = useRef<string>(`web:${crypto.randomUUID()}`);

  // gravação...
  const [isRecording, setIsRecording] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

  const supportsWebm = useMemo(() => {
    return MediaRecorder.isTypeSupported?.("audio/webm;codecs=opus") ?? true;
  }, []);

  // ====== Fluxo de Chat (texto) ======
  const sendTextMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    try {
      const data = await chat("lyra", sidRef.current, text);

      // LangGraph geralmente retorna { output: "..." }
      const reply =
        (data as any).reply_text ??
        (data as any).output ??
        "(sem resposta)";

      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply,
      };
      setMessages((m) => [...m, botMsg]);
    } catch (e: any) {
      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Erro ao chamar o agente: ${e?.message ?? "desconhecido"}`,
      };
      setMessages((m) => [...m, botMsg]);
    }
  };

  // ====== Gravação de Áudio ======
  const startRecording = async () => {
    setPermissionError(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setPermissionError("Seu navegador não permite acesso ao microfone.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mimeType = supportsWebm ? "audio/webm;codecs=opus" : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await handleTranscription(blob);
        cleanupMedia();
      };

      mediaRecorderRef.current = recorder;
      setRecordSecs(0);
      setShowOverlay(true);
      setIsRecording(true);
      recorder.start();

      // contador simples
      timerRef.current = window.setInterval(() => {
        setRecordSecs((s) => s + 1);
      }, 1000) as unknown as number;
    } catch (err: any) {
      console.error(err);
      setPermissionError(
        err?.name === "NotAllowedError"
          ? "Permissão negada para usar o microfone. Verifique as configurações do navegador."
          : "Não foi possível acessar o microfone."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const cancelRecording = () => {
    // cancela sem enviar
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    cleanupMedia();
    setShowOverlay(false);
    setIsRecording(false);
  };

  const cleanupMedia = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
  };

  useEffect(() => {
    return () => cleanupMedia();
  }, []);

  // ====== Envio ao Endpoint de Transcrição ======
  const handleTranscription = async (blob: Blob) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: "[Áudio enviado — transcrevendo…]",
    };
    setMessages((m) => [...m, userMsg]);

    try {
      const data = await transcribeWebm(blob);
      const texto = data.text ?? data.error ?? "[Não foi possível transcrever o áudio]";

      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: texto,
      };
      setMessages((m) => [...m, botMsg]);
    } catch (e: any) {
      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Ocorreu um erro ao transcrever: ${e?.message ?? "erro desconhecido"}`,
      };
      setMessages((m) => [...m, botMsg]);
    } finally {
      setShowOverlay(false);
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-rows-[auto_1fr_auto] p-4 md:p-8 gap-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/images/lyra.svg" alt="Lyra" />
            <AvatarFallback>LY</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold">Lyra</h1>
            <p className="text-muted-foreground text-sm">Fale ou digite sua mensagem.</p>
          </div>
        </div>
        <Button size="lg" onClick={startRecording} className="gap-2">
          <span className="material-symbols-rounded">mic</span>
          Falar
        </Button>
      </div>

      {/* Área do chat */}
      <Card className="p-4 md:p-6 shadow-card overflow-hidden">
        <div className="h-[55vh] overflow-y-auto pr-3" id="chat-scroll">
          <ul className="space-y-4">
            {messages.map((m) => (
              <li
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {m.content}
                  <div
                    className={`mt-1 text-[10px] opacity-70 ${
                      m.role === "user"
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {horaCurta()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Entrada de texto */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendTextMessage();
            }
          }}
          className="flex-1 rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring focus:ring-primary/30"
          placeholder="Digite sua mensagem..."
        />
        <Button variant="outline" onClick={startRecording} className="gap-2">
          <span className="material-symbols-rounded">mic</span>
          <span className="hidden sm:inline">Falar</span>
        </Button>
        <Button onClick={sendTextMessage} className="gap-2">
          <span className="material-symbols-rounded">send</span>
          Enviar
        </Button>
      </div>

      {/* Overlay de Gravação em Tela Inteira */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6">
          <Card className="w-full max-w-lg p-8 text-center relative overflow-hidden">
            <button
              onClick={cancelRecording}
              className="absolute top-3 right-3 rounded-full p-2 hover:bg-muted"
              aria-label="Fechar"
            >
              <span className="material-symbols-rounded">close</span>
            </button>

            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
              <div className="flex gap-2 items-end">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 rounded-full bg-primary animate-wave"
                    style={{ height: "48px", animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-heading font-semibold mb-1">
              {isRecording ? "Gravando…" : "Pronto para gravar"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {permissionError
                ? permissionError
                : 'Fale naturalmente. Clique em "Parar" quando terminar.'}
            </p>
            <div className="text-sm text-muted-foreground mb-6">
              Tempo: {recordSecs}s
            </div>

            <div className="flex gap-3">
              {isRecording ? (
                <Button onClick={stopRecording} size="lg" className="flex-1 gap-2">
                  <span className="material-symbols-rounded">stop_circle</span>
                  Parar
                </Button>
              ) : (
                <Button
                  onClick={startRecording}
                  size="lg"
                  variant="secondary"
                  className="flex-1 gap-2"
                >
                  <span className="material-symbols-rounded">mic</span>
                  Gravar
                </Button>
              )}
              <Button
                onClick={cancelRecording}
                size="lg"
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>

            {!supportsWebm && (
              <div className="mt-6 text-xs text-muted-foreground">
                Aviso: seu navegador pode não suportar <code>audio/webm</code>.
                Considere outro navegador.
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Estilos auxiliares para as barras animadas */}
      <style>{`
        @keyframes wave { 0% { transform: scaleY(0.4); } 100% { transform: scaleY(1); } }
        .animate-wave { animation: wave 0.9s ease-in-out infinite alternate; transform-origin: bottom; }
      `}</style>
    </div>
  );
};

export default ChatVozPTBR;
