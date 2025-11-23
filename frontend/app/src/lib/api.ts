// frontend/app/src/lib/api.ts
const BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:2024";

// Agora usamos os IDs dos grafos do langgraph.json
export type AgentId = "patient" | "doctor";

export async function chat(agent: AgentId, sessionId: string, input: string) {
  const res = await fetch(`${BASE}/assistants/${agent}/invoke`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input,
      config: {
        configurable: {
          thread_id: sessionId, // importantíssimo p/ manter histórico por paciente/médico
        },
      },
    }),
  });

  if (!res.ok) throw new Error(`Chat falhou: ${res.status}`);

  // LangGraph dev geralmente retorna { output: "...", ... }
  return res.json() as Promise<{
    output?: string;
    messages?: any;
    [k: string]: any;
  }>;
}

// transcribeWebm permanece igual
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
