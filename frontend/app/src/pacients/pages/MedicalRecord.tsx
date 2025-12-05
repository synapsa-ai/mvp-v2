import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Image as ImageIcon, Mic, Tag as TagIcon } from "lucide-react";

type DiaryEntry = {
  id: string;
  data: string;
  humor: string;
  texto: string;
  fotos: string[];
  audio?: string | null; 
  tags: string[];
  xp: number;
};

const HUMORES = ["😊", "😞", "😐", "😡", "😴", "😰", "🤩"];

export default function Diary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [novo, setNovo] = useState(false);
  const [visualizar, setVisualizar] = useState<DiaryEntry | null>(null);

  const [humor, setHumor] = useState("");
  const [texto, setTexto] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [fotos, setFotos] = useState<string[]>([]);
  const [audio, setAudio] = useState<string | null>(null);

  const [streak, setStreak] = useState(1);

  // XP calculado por quantidade de conteúdo
  const calcularXP = () => {
    let xp = 10;
    xp += texto.length / 20;
    xp += tags.length * 5;
    xp += fotos.length * 8;
    if (audio) xp += 20;
    return Math.round(xp);
  };

  // Upload mock de imagens (base64)
  const handleFotoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFotos([...fotos, reader.result as string]);
    };
    reader.readAsDataURL(file);
  };

  // Upload mock de áudio (base64)
  const handleAudioUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAudio(reader.result as string);
    reader.readAsDataURL(file);
  };

  const salvarEntrada = () => {
    if (!humor || !texto.trim()) return;

    const nova: DiaryEntry = {
      id: Date.now().toString(),
      data: new Date().toLocaleDateString("pt-BR"),
      humor,
      texto,
      fotos,
      audio,
      tags,
      xp: calcularXP(),
    };

    setEntries([nova, ...entries]);

    // Reset campos
    setHumor("");
    setTexto("");
    setFotos([]);
    setAudio(null);
    setTags([]);
    setTagInput("");

    setNovo(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Seu Diário</h1>
        <p className="text-muted-foreground">
          Um espaço seguro para você se expressar todos os dias
        </p>

        <div className="flex items-center gap-3 mt-2">
          <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            🔥 Streak: {streak} dia(s)
          </div>
          <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            ⭐ XP Total: {entries.reduce((acc, e) => acc + e.xp, 0)}
          </div>
        </div>
      </div>

      {/* ENTRADA DO DIA */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-xl">
        <CardContent className="p-5 space-y-4">
          <h2 className="text-lg font-semibold">Como você está hoje?</h2>

          <div className="flex gap-3 flex-wrap">
            {HUMORES.map((h) => (
              <button
                key={h}
                onClick={() => {
                  setHumor(h);
                  setNovo(true);
                }}
                className={`text-3xl hover:scale-110 transition ${
                  humor === h ? "opacity-100" : "opacity-70"
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          <Button className="mt-2 w-full" onClick={() => setNovo(true)}>
            Registrar meu dia
          </Button>
        </CardContent>
      </Card>

      {/* LISTA DE ENTRADAS */}
      <div className="space-y-4">
        {entries.length === 0 && (
          <p className="text-muted-foreground mt-10 text-center">
            Nenhum registro ainda. Comece registrando como você está hoje.
          </p>
        )}

        {entries.map((entry) => (
          <Card
            key={entry.id}
            className="cursor-pointer hover:shadow-md transition-all rounded-xl"
            onClick={() => setVisualizar(entry)}
          >
            <CardContent className="p-5 space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl">{entry.humor}</span>
                <span className="text-xs text-muted-foreground">{entry.data}</span>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-3">
                {entry.texto}
              </p>

              <div className="flex gap-2 mt-2">
                {entry.fotos.length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    📸 {entry.fotos.length}
                  </span>
                )}

                {entry.audio && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    🎤 Áudio
                  </span>
                )}

                {entry.tags.length > 0 && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    🏷️ {entry.tags.join(", ")}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MODAL CRIAÇÃO */}
      <Dialog open={novo} onOpenChange={setNovo}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Registrar meu dia</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Como você está se sentindo?</label>
              <div className="flex gap-3 mt-2">
                {HUMORES.map((h) => (
                  <button
                    key={h}
                    className={`text-3xl transition ${
                      humor === h ? "opacity-100" : "opacity-60"
                    }`}
                    onClick={() => setHumor(h)}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Escreva sobre seu dia</label>
              <Textarea
                rows={5}
                className="mt-1"
                placeholder="Escreva como se estivesse conversando com você mesmo..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
            </div>

            {/* TAGS */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <TagIcon size={16} /> Tags
              </label>

              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Ansiedade, foco, etc."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (tagInput.trim()) {
                      setTags([...tags, tagInput.trim()]);
                      setTagInput("");
                    }
                  }}
                >
                  Adicionar
                </Button>
              </div>

              <div className="flex gap-2 flex-wrap mt-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* FOTOS */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <ImageIcon size={16} /> Fotos
              </label>

              <Input type="file" accept="image/*" onChange={handleFotoUpload} />

              <div className="flex gap-2 mt-2">
                {fotos.map((f, i) => (
                  <img
                    key={i}
                    src={f}
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                ))}
              </div>
            </div>

            {/* AUDIO */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Mic size={16} /> Áudio
              </label>

              <Input type="file" accept="audio/*" onChange={handleAudioUpload} />

              {audio && <p className="text-xs mt-1 text-muted-foreground">🎤 Áudio adicionado</p>}
            </div>

            <Button className="w-full mt-2" onClick={salvarEntrada}>
              Salvar Registro
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL VISUALIZAR */}
      {visualizar && (
        <Dialog open={!!visualizar} onOpenChange={() => setVisualizar(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                {visualizar.humor} Registro do dia
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">{visualizar.data}</p>

              {/* FOTOS */}
              {visualizar.fotos.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {visualizar.fotos.map((f, i) => (
                    <img
                      key={i}
                      src={f}
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              )}

              {/* AUDIO */}
              {visualizar.audio && (
                <audio controls className="w-full">
                  <source src={visualizar.audio} />
                </audio>
              )}

              {/* TEXTO */}
              <p className="text-sm whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-lg border">
                {visualizar.texto}
              </p>

              {/* TAGS */}
              {visualizar.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {visualizar.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* XP */}
              <p className="text-sm font-medium mt-3 text-purple-700">
                ⭐ XP ganho neste dia: {visualizar.xp}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
