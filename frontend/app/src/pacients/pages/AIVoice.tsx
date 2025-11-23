// src/pacients/pages/AIVoice.tsx

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

const horaCurta = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const AIVoice = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Oi! Como você está se sentindo hoje? Você pode me falar ou escrever :)",
    },
  ]);
  const [input, setInput] = useState("");

  // thread_id estável por aba
  const sidRef = useRef<string>(`patient:${crypto.randomUUID()}`);

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

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    try {
      const data = await chat("patient", sidRef.current, text);

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

  const handleTranscription = async (blob: Blob) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: "[Áudio enviado — transcrevendo…]",
    };
    setMessages((m) => [...m, userMsg]);

    try {
      const data = await transcribeWebm(blob);
      const texto =
        data.text ?? data.error ?? "[Não foi possível transcrever o áudio]";

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
        content: `Ocorreu um erro ao transcrever: ${
          e?.message ?? "erro desconhecido"
        }`,
      };
      setMessages((m) => [...m, botMsg]);
    } finally {
      setShowOverlay(false);
      setIsRecording(false);
    }
  };

  return (
  <div className="grid grid-rows-[auto_1fr_auto] gap-3 pt-2 md:pt-3 pb-4 md:pb-6 px-4 md:px-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/images/lyra.svg" alt="Lyra" />
            <AvatarFallback>LY</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold">
              Lyra
            </h1>
            <p className="text-muted-foreground text-sm">
              Fale ou digite sua mensagem.
            </p>
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
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
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

      {/* Overlay de gravação – mantém o teu código aqui se quiser */}
      {showOverlay && <></>}
      {permissionError && (
        <p className="text-xs text-destructive mt-2">{permissionError}</p>
      )}
    </div>
  );
};

export default AIVoice;
