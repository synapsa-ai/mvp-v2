import { useState } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  FileText,
  MessageSquare,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Card, CardContent } from "@/components/ui/card";

import { useApp } from "@/professionals/context/AppContext";
import { Paciente } from "@/professionals/types";

/* ===========================================================
   COMPONENTE PRINCIPAL
=========================================================== */

export const Pacientes = () => {
  const { pacientes, updatePacientes } = useApp();
  const { toast } = useToast();

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");

  const [pacienteSelecionado, setPacienteSelecionado] =
    useState<Paciente | null>(null);
  const [modalNovoPaciente, setModalNovoPaciente] = useState(false);

  /* ===========================================================
     ESTADOS DO FORMULÁRIO DE NOVO PACIENTE
  =========================================================== */

  const [novoNome, setNovoNome] = useState("");
  const [novoTelefone, setNovoTelefone] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoStatus, setNovoStatus] = useState<
    "ativo" | "alta" | "risco"
  >("ativo");
  const [novasEtiquetas, setNovasEtiquetas] = useState("");
  const [novasObservacoes, setNovasObservacoes] = useState("");

  /* ===========================================================
     FILTRO DE PACIENTES
  =========================================================== */

  const pacientesFiltrados = pacientes.filter((p) => {
    const buscaLower = busca.toLowerCase();
    const matchBusca =
      p.nome.toLowerCase().includes(buscaLower) ||
      p.telefone.includes(busca) ||
      p.email.toLowerCase().includes(buscaLower);

    const matchStatus = filtroStatus === "todos" || p.status === filtroStatus;

    return matchBusca && matchStatus;
  });

  /* ===========================================================
     ADICIONAR NOVO PACIENTE
  =========================================================== */

  const handleNovoPaciente = () => {
    if (!novoNome.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Preencha o nome do paciente.",
        variant: "destructive",
      });
      return;
    }

    const novoPaciente: Paciente = {
      id: Date.now().toString(),
      nome: novoNome.trim(),
      telefone: novoTelefone.trim(),
      email: novoEmail.trim(),
      status: novoStatus,
      etiquetas: novasEtiquetas
        ? novasEtiquetas.split(",").map((e) => e.trim())
        : [],
      responsavel: "Agente Principal",
      observacoes: novasObservacoes.trim(),

      prontuario: {
        notasClinicas: "",
        historico: [],
        arquivos: [],
        emocoesFrequentes: [],
        queixasAtuais: "",
        plano: "",
      },

      comunicacao: [],
      criadoEm: new Date().toISOString(),
    };

    updatePacientes([...pacientes, novoPaciente]);

    setNovoNome("");
    setNovoTelefone("");
    setNovoEmail("");
    setNovoStatus("ativo");
    setNovasEtiquetas("");
    setNovasObservacoes("");
    setModalNovoPaciente(false);

    toast({
      title: "Paciente criado",
      description: `${novoPaciente.nome} foi adicionado.`,
    });
  };

  /* ===========================================================
     FUNÇÕES AUXILIARES DO PRONTUÁRIO
  =========================================================== */

  const atualizarCampo = (campo: string, valor: any) => {
    const updated = pacientes.map((p) =>
      p.id === pacienteSelecionado!.id ? { ...p, [campo]: valor } : p
    );
    updatePacientes(updated);
    setPacienteSelecionado((prev: any) => ({ ...prev, [campo]: valor }));
  };

  const atualizarProntuario = (campo: string, valor: any) => {
    const updated = pacientes.map((p) =>
      p.id === pacienteSelecionado!.id
        ? { ...p, prontuario: { ...p.prontuario, [campo]: valor } }
        : p
    );
    updatePacientes(updated);

    setPacienteSelecionado((prev: any) => ({
      ...prev,
      prontuario: { ...prev.prontuario, [campo]: valor },
    }));
  };

  const toggleEmocao = (emocao: string) => {
    const lista = pacienteSelecionado!.prontuario.emocoesFrequentes || [];
    const novaLista = lista.includes(emocao)
      ? lista.filter((e: string) => e !== emocao)
      : [...lista, emocao];

    atualizarProntuario("emocoesFrequentes", novaLista);
  };

  const adicionarEmocaoCustom = () => {
    const input = document.getElementById("novaEmocao") as HTMLInputElement;
    if (!input.value.trim()) return;

    toggleEmocao(input.value.trim());
    input.value = "";
  };

  const adicionarEvolucao = () => {
    const textarea = document.getElementById(
      "novaEvolucao"
    ) as HTMLTextAreaElement;
    if (!textarea.value.trim()) return;

    const novaEntrada = {
      data: new Date().toISOString(),
      conteudo: textarea.value.trim(),
    };

    const historicoAnterior =
      pacienteSelecionado!.prontuario.historico || [];

    atualizarProntuario("historico", [...historicoAnterior, novaEntrada]);

    textarea.value = "";
  };

  const removerPaciente = () => {
    if (!confirm("Deseja remover este paciente?")) return;

    updatePacientes(
      pacientes.filter((p) => p.id !== pacienteSelecionado!.id)
    );

    setPacienteSelecionado(null);
  };

  /* ===========================================================
     CORES DO STATUS
  =========================================================== */

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-500/10 text-green-700";
      case "alta":
        return "bg-blue-500/10 text-blue-700";
      case "risco":
        return "bg-red-500/10 text-red-700";
      default:
        return "bg-gray-500/10 text-gray-700";
    }
  };

  /* ===========================================================
     RENDERIZAÇÃO DO COMPONENTE
  =========================================================== */

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pacientes</h1>
          <p className="text-muted-foreground">
            {pacientes.length} paciente(s) cadastrado(s)
          </p>
        </div>

        <Dialog open={modalNovoPaciente} onOpenChange={setModalNovoPaciente}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Adicionar Paciente
            </Button>
          </DialogTrigger>

          {/* ===========================================================
              MODAL DE NOVO PACIENTE
          =========================================================== */}

          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Paciente</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Nome *</Label>
                <Input
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                />
              </div>

              <div>
                <Label>Telefone</Label>
                <Input
                  value={novoTelefone}
                  onChange={(e) => setNovoTelefone(e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={novoStatus}
                  onValueChange={(v: any) => setNovoStatus(v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="alta">Inativo</SelectItem>
                    
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Etiquetas</Label>
                <Input
                  value={novasEtiquetas}
                  onChange={(e) => setNovasEtiquetas(e.target.value)}
                  placeholder="Separe por vírgulas"
                />
              </div>

              <div>
                <Label>Observações</Label>
                <Textarea
                  rows={3}
                  value={novasObservacoes}
                  onChange={(e) => setNovasObservacoes(e.target.value)}
                />
              </div>

              <Button className="w-full" onClick={handleNovoPaciente}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ===========================================================
          FILTRO + BUSCA
      =========================================================== */}

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Buscar por nome, telefone ou email"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={filtroStatus === "todos" ? "default" : "outline"}
                onClick={() => setFiltroStatus("todos")}
              >
                Todos
              </Button>
              <Button
                variant={filtroStatus === "ativo" ? "default" : "outline"}
                onClick={() => setFiltroStatus("ativo")}
              >
                Ativos
              </Button>
              <Button
                variant={filtroStatus === "alta" ? "default" : "outline"}
                onClick={() => setFiltroStatus("alta")}
              >
                Alta
              </Button>
              <Button
                variant={filtroStatus === "risco" ? "default" : "outline"}
                onClick={() => setFiltroStatus("risco")}
              >
                Risco
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===========================================================
          TABELA DE PACIENTES
      =========================================================== */}

      {pacientesFiltrados.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Plus className="w-8 h-8 text-muted-foreground mb-4" />

            <h3 className="text-lg font-semibold">Nenhum paciente</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comece cadastrando seu primeiro paciente.
            </p>

            <Button onClick={() => setModalNovoPaciente(true)}>
              <Plus className="mr-2 h-4 w-4" /> Novo Paciente
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Diagnóstico</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pacientesFiltrados.map((p) => (
                <TableRow
                  key={p.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{p.nome}</TableCell>
                  <TableCell>{p.telefone || "-"}</TableCell>
                  <TableCell>{p.email || "-"}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(p.status)}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="truncate max-w-[200px]">
                    {p.diagnosticoPrincipal || "-"}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setPacienteSelecionado(p)}
                        >
                          <FileText className="mr-2 w-4 h-4" />
                          Ver Prontuário
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 w-4 h-4" />
                          Enviar mensagem
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <Calendar className="mr-2 w-4 h-4" />
                          Agendar consulta
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* ===========================================================
          MODAL DE PRONTUÁRIO — COMPLETO E FORMATADO
      =========================================================== */}

      {pacienteSelecionado && (
        <Dialog
          open={!!pacienteSelecionado}
          onOpenChange={() => setPacienteSelecionado(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Prontuário — {pacienteSelecionado.nome}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* =======================================================
                  1. DADOS PESSOAIS (ACCORDION)
              ======================================================= */}
              <Accordion type="single" collapsible defaultValue="dados">
                <AccordionItem value="dados">
                  <AccordionTrigger className="text-lg font-semibold">
                    Dados Pessoais
                  </AccordionTrigger>

                  <AccordionContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Nome</Label>
                        <Input
                          value={pacienteSelecionado.nome}
                          onChange={(e) =>
                            atualizarCampo("nome", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <Label>Telefone</Label>
                        <Input
                          value={pacienteSelecionado.telefone}
                          onChange={(e) =>
                            atualizarCampo("telefone", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <Label>Email</Label>
                        <Input
                          value={pacienteSelecionado.email}
                          onChange={(e) =>
                            atualizarCampo("email", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <Label>Nascimento</Label>
                        <Input
                          type="date"
                          value={pacienteSelecionado.nascimento || ""}
                          onChange={(e) =>
                            atualizarCampo("nascimento", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <Label>Gênero</Label>
                        <Input
                          value={pacienteSelecionado.genero || ""}
                          onChange={(e) =>
                            atualizarCampo("genero", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <Label>Estado civil</Label>
                        <Input
                          value={pacienteSelecionado.estadoCivil || ""}
                          onChange={(e) =>
                            atualizarCampo("estadoCivil", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <Label>Profissão</Label>
                        <Input
                          value={pacienteSelecionado.profissao || ""}
                          onChange={(e) =>
                            atualizarCampo("profissao", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <Label>Contato de emergência</Label>
                        <Input
                          value={pacienteSelecionado.emergencia || ""}
                          onChange={(e) =>
                            atualizarCampo("emergencia", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Endereço</Label>
                      <Input
                        value={pacienteSelecionado.endereco || ""}
                        onChange={(e) =>
                          atualizarCampo("endereco", e.target.value)
                        }
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* =======================================================
                  2. EMOÇÕES FREQUENTES
              ======================================================= */}

              <Accordion type="single" collapsible>
                <AccordionItem value="emocoes">
                  <AccordionTrigger className="text-lg font-semibold">
                    Emoções Frequentes
                  </AccordionTrigger>

                  <AccordionContent className="space-y-4">
                    <Label>Selecione:</Label>

                    <div className="flex gap-2 flex-wrap">
                      {[
                        "Ansioso",
                        "Triste",
                        "Irritado",
                        "Cansado",
                        "Motivado",
                        "Sobrecarregado",
                      ].map((e) => (
                        <Button
                          key={e}
                          size="sm"
                          variant={
                            pacienteSelecionado.prontuario.emocoesFrequentes?.includes(
                              e
                            )
                              ? "default"
                              : "outline"
                          }
                          onClick={() => toggleEmocao(e)}
                        >
                          {e}
                        </Button>
                      ))}
                    </div>

                    <div>
                      <Label>Adicionar emoção personalizada</Label>
                      <div className="flex gap-2">
                        <Input id="novaEmocao" placeholder="Digite a emoção" />
                        <Button onClick={adicionarEmocaoCustom}>
                          Adicionar
                        </Button>
                      </div>
                    </div>

                    {pacienteSelecionado.prontuario.emocoesFrequentes
                      ?.length > 0 && (
                      <div>
                        <Label>Selecionadas:</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {pacienteSelecionado.prontuario.emocoesFrequentes.map(
                            (e) => (
                              <Badge
                                key={e}
                                variant="secondary"
                                className="cursor-pointer"
                                onClick={() => toggleEmocao(e)}
                              >
                                {e} ✕
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* =======================================================
                  3. INFORMAÇÕES CLÍNICAS
              ======================================================= */}
              <Accordion type="single" collapsible>
                <AccordionItem value="clinico">
                  <AccordionTrigger className="text-lg font-semibold">
                    Informações Clínicas
                  </AccordionTrigger>

                  <AccordionContent className="space-y-4">
                    <div>
                      <Label>Diagnóstico principal</Label>
                      <Input
                        value={pacienteSelecionado.diagnosticoPrincipal || ""}
                        onChange={(e) =>
                          atualizarCampo(
                            "diagnosticoPrincipal",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label>Queixas atuais</Label>
                      <Textarea
                        rows={3}
                        value={
                          pacienteSelecionado.prontuario.queixasAtuais || ""
                        }
                        onChange={(e) =>
                          atualizarProntuario(
                            "queixasAtuais",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label>Notas clínicas</Label>
                      <Textarea
                        rows={5}
                        value={
                          pacienteSelecionado.prontuario.notasClinicas || ""
                        }
                        onChange={(e) =>
                          atualizarProntuario(
                            "notasClinicas",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* =======================================================
                  4. EVOLUÇÃO CLÍNICA
              ======================================================= */}

              <Accordion type="single" collapsible>
                <AccordionItem value="evolucao">
                  <AccordionTrigger className="text-lg font-semibold">
                    Evolução Clínica
                  </AccordionTrigger>

                  <AccordionContent className="space-y-4">
                    <Label>Registrar evolução</Label>
                    <Textarea
                      id="novaEvolucao"
                      rows={4}
                      placeholder="Escreva a evolução da sessão"
                    />
                    <Button className="w-full" onClick={adicionarEvolucao}>
                      Salvar evolução
                    </Button>

                    <div className="space-y-3 pt-4">
                      {pacienteSelecionado.prontuario.historico?.map(
                        (h, i) => (
                          <Card key={i}>
                            <CardContent className="p-4">
                              <p className="text-sm text-muted-foreground">
                                {new Date(h.data).toLocaleString("pt-BR")}
                              </p>
                              <p>{h.conteudo}</p>
                            </CardContent>
                          </Card>
                        )
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* =======================================================
                  5. PLANO TERAPÊUTICO
              ======================================================= */}

              <Accordion type="single" collapsible>
                <AccordionItem value="plano">
                  <AccordionTrigger className="text-lg font-semibold">
                    Plano Terapêutico
                  </AccordionTrigger>

                  <AccordionContent>
                    <Textarea
                      rows={6}
                      placeholder="Objetivos, estratégias, intervenções…"
                      value={pacienteSelecionado.prontuario.plano || ""}
                      onChange={(e) =>
                        atualizarProntuario("plano", e.target.value)
                      }
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* =======================================================
                  6. ANEXOS
              ======================================================= */}

              <Accordion type="single" collapsible>
                <AccordionItem value="anexos">
                  <AccordionTrigger className="text-lg font-semibold">
                    Anexos
                  </AccordionTrigger>

                  <AccordionContent>
                    <Button variant="outline">
                      Adicionar arquivo (em breve)
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* =======================================================
                  7. REMOVER PACIENTE
              ======================================================= */}

              <Button
                variant="destructive"
                className="w-full mt-6"
                onClick={removerPaciente}
              >
                Remover Paciente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
