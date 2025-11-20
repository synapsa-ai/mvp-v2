import { useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Msg { id: string; role: "user" | "assistant"; content: string }

export default function ChatSIA() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: crypto.randomUUID(), role: "assistant", content: "Olá! Eu sou a SIA — sua assistente administrativa. Posso marcar consultas, remarcar/cancelar e gerenciar a agenda dos profissionais." },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: text }]);
    setInput("");
    // Substitua por chamada ao seu backend/LLM
    setTimeout(() => {
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: "Mensagem recebida. Deseja marcar, remarcar ou cancelar uma consulta?" }]);
    }, 300);
  };

  const quick = (q: string) => setInput(q);

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink to="/home">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Chat — SIA</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Coluna esquerda: conversas/atalhos */}
        <Card>
          <CardHeader>
            <CardTitle>Conversas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">Lista de conversas aparecerá aqui.</div>
            <Separator />
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Ações rápidas</div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => quick("Quero marcar uma consulta para amanhã às 14h com a Dra. Ana.")}>Marcar</Button>
                <Button variant="outline" size="sm" onClick={() => quick("Preciso remarcar a consulta do João de 10/11 para 12/11 às 16h.")}>Remarcar</Button>
                <Button variant="outline" size="sm" onClick={() => quick("Cancelar consulta do Pedro em 15/11 às 09h.")}>Cancelar</Button>
                <Button variant="outline" size="sm" onClick={() => quick("Mostrar a agenda da próxima semana.")}>Ver agenda</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coluna direita: thread */}
        <Card className="flex flex-col">
          <CardHeader className="flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/images/sia.svg" alt="SIA" />
                <AvatarFallback>SIA</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="leading-tight">SIA</CardTitle>
                <div className="text-xs text-muted-foreground">Assistente administrativa • marcação e gestão de consultas</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Nova conversa</Button>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="flex-1 min-h-[360px] py-4">
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-4 border-t flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Descreva o que precisa (marcar, remarcar, cancelar, ver agenda, etc.)"
              className="min-h-[72px]"
            />
            <Button onClick={send}>Enviar</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
