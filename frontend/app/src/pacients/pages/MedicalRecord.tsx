import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function Notes() {
  // MOCK — depois troca por useApp().notes
  const [notes, setNotes] = useState([
    {
      id: "1",
      titulo: "Reflexão sobre minha semana",
      conteudo:
        "Percebi que fico mais ansioso quando não sigo uma rotina bem definida. Melhorar meu sono pode ajudar.",
      data: "27/11/2025"
    },
    {
      id: "2",
      titulo: "Coisas que quero comentar na próxima sessão",
      conteudo:
        "• Falar sobre cansaço constante\n• Comentar sobre dificuldade de foco no trabalho\n• Pedir dicas de organização",
      data: "25/11/2025"
    }
  ]);

  const [modal, setModal] = useState<any | null>(null);
  const [novo, setNovo] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");

  const criarNota = () => {
    if (!titulo.trim() || !conteudo.trim()) return;

    const nova = {
      id: Date.now().toString(),
      titulo,
      conteudo,
      data: new Date().toLocaleDateString("pt-BR")
    };

    setNotes([nova, ...notes]);
    setTitulo("");
    setConteudo("");
    setNovo(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Anotações</h1>
          <p className="text-muted-foreground">Um espaço privado só para você</p>
        </div>

        <Button onClick={() => setNovo(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Anotação
        </Button>
      </div>

      {/* LISTA */}
      <div className="space-y-3">
        {notes.length === 0 && (
          <p className="text-muted-foreground">Nenhuma anotação ainda.</p>
        )}

        {notes.map((n) => (
          <Card
            key={n.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setModal(n)}
          >
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{n.titulo}</h3>
                <span className="text-xs text-muted-foreground">{n.data}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {n.conteudo}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MODAL NOVA NOTA */}
      <Dialog open={novo} onOpenChange={setNovo}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Anotação</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Título</label>
              <input
                className="w-full border p-2 rounded-md bg-background mt-1"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Ideias para falar na sessão"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Conteúdo</label>
              <Textarea
                className="mt-1"
                rows={6}
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                placeholder="Escreva o que quiser..."
              />
            </div>

            <Button className="w-full" onClick={criarNota}>
              Salvar Anotação
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL VER NOTA */}
      {modal && (
        <Dialog open={!!modal} onOpenChange={() => setModal(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{modal.titulo}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">{modal.data}</p>
              <p className="text-sm whitespace-pre-wrap">{modal.conteudo}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
