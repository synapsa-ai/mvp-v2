// frontend/app/src/lib/api.ts
const BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:2024";

export async function chat(agent: "lyra" | "sin", sessionId: string, input: string) {
  const res = await fetch(`${BASE}/assistants/${agent}/invoke`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input,
      config: { configurable: { thread_id: sessionId } },
    }),
  });
  if (!res.ok) throw new Error(`Chat falhou: ${res.status}`);
  // A resposta do LangGraph costuma vir como { output: "...", ... }
  return res.json() as Promise<{ output?: string; messages?: any; [k: string]: any }>;
}

// Se teu /transcribe é FastAPI próprio, mantém outro BASE separado ou troca por esse serviço.
// Se NÃO tens transcrição no LangGraph, este endpoint continua apontando pro teu FastAPI.
export async function transcribeWebm(blob: Blob) {
  const base = import.meta.env.VITE_TRANSCRIBE_BASE ?? "/api";
  const res = await fetch(`${base}/transcribe`, {
    method: "POST",
    headers: { "Content-Type": "audio/webm" },
    body: blob,
  });
  if (!res.ok) throw new Error(`Transcrição falhou: ${res.status}`);
  return res.json() as Promise<{ text?: string; error?: string }>;
}
