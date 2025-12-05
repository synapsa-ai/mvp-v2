import { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, FileText, MessageSquare, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
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
import { useApp } from '@/professionals/context/AppContext';
import { Paciente } from '@/professionals/types';
import { Card, CardContent} from '@/components/ui/card';

export const Pacientes = () => {
  const { pacientes, updatePacientes } = useApp();
  const { toast } = useToast();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
  const [modalNovoPaciente, setModalNovoPaciente] = useState(false);
  
  // Estado do formulário de novo paciente
  const [novoNome, setNovoNome] = useState('');
  const [novoTelefone, setNovoTelefone] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novoStatus, setNovoStatus] = useState<'ativo' | 'alta' | 'risco'>('ativo');
  const [novasEtiquetas, setNovasEtiquetas] = useState('');
  const [novasObservacoes, setNovasObservacoes] = useState('');

  // Filtrar pacientes
  const pacientesFiltrados = pacientes.filter(p => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase()) ||
                       p.telefone.includes(busca) ||
                       p.email.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'todos' || p.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const handleNovoPaciente = () => {
    if (!novoNome.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Por favor, preencha o nome do paciente.',
        variant: 'destructive',
      });
      return;
    }

    const novoPaciente: Paciente = {
      id: Date.now().toString(),
      nome: novoNome.trim(),
      telefone: novoTelefone.trim(),
      email: novoEmail.trim(),
      status: novoStatus,
      etiquetas: novasEtiquetas ? novasEtiquetas.split(',').map(e => e.trim()).filter(e => e) : [],
      responsavel: 'Agente Principal',
      observacoes: novasObservacoes.trim(),
      prontuario: {
        notasClinicas: '',
        historico: [],
        arquivos: [],
      },
      comunicacao: [],
      criadoEm: new Date().toISOString(),
    };
    
    updatePacientes([...pacientes, novoPaciente]);
    
    // Limpar formulário
    setNovoNome('');
    setNovoTelefone('');
    setNovoEmail('');
    setNovoStatus('ativo');
    setNovasEtiquetas('');
    setNovasObservacoes('');
    setModalNovoPaciente(false);
    
    toast({
      title: '✓ Paciente criado com sucesso',
      description: `${novoPaciente.nome} foi adicionado à lista de pacientes.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'alta': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'risco': return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pacientes</h1>
          <p className="text-muted-foreground">
            {pacientes.length} paciente{pacientes.length !== 1 ? 's' : ''} cadastrado{pacientes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Dialog open={modalNovoPaciente} onOpenChange={setModalNovoPaciente}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Adicionar Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Paciente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Nome completo do paciente"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={novoTelefone}
                  onChange={(e) => setNovoTelefone(e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={novoStatus} onValueChange={(value: any) => setNovoStatus(value)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="alta">Inativo</SelectItem>
                    
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="etiquetas">Etiquetas</Label>
                <Input
                  id="etiquetas"
                  value={novasEtiquetas}
                  onChange={(e) => setNovasEtiquetas(e.target.value)}
                  placeholder="Separadas por vírgula"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={novasObservacoes}
                  onChange={(e) => setNovasObservacoes(e.target.value)}
                  placeholder="Informações adicionais"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleNovoPaciente} className="flex-1">
                  Salvar Paciente
                </Button>
                <Button variant="outline" onClick={() => setModalNovoPaciente(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, telefone ou email..."
                  className="pl-10"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filtroStatus === 'todos' ? 'default' : 'outline'}
                onClick={() => setFiltroStatus('todos')}
              >
                Todos
              </Button>
              <Button
                variant={filtroStatus === 'ativo' ? 'default' : 'outline'}
                onClick={() => setFiltroStatus('ativo')}
              >
                Ativos
              </Button>
              <Button
                variant={filtroStatus === 'alta' ? 'default' : 'outline'}
                onClick={() => setFiltroStatus('alta')}
              >
                Alta
              </Button>
              <Button
                variant={filtroStatus === 'risco' ? 'default' : 'outline'}
                onClick={() => setFiltroStatus('risco')}
              >
                Risco
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Pacientes */}
      {pacientesFiltrados.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {pacientes.length === 0 ? 'Nenhum paciente cadastrado' : 'Nenhum resultado encontrado'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {pacientes.length === 0 
                ? 'Comece cadastrando seu primeiro paciente' 
                : 'Tente ajustar os filtros de busca'}
            </p>
            {pacientes.length === 0 && (
              <Button onClick={() => setModalNovoPaciente(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar Primeiro Paciente
              </Button>
            )}
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
                <TableHead>Próxima Consulta</TableHead>
                <TableHead>Última Consulta</TableHead>
                <TableHead>Diagnóstico</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pacientesFiltrados.map((paciente) => (
                <TableRow key={paciente.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{paciente.nome}</TableCell>
                  <TableCell>{paciente.telefone || '-'}</TableCell>
                  <TableCell>{paciente.email || '-'}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(paciente.status)}>
                      {paciente.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {paciente.proximaConsulta 
                      ? new Date(paciente.proximaConsulta).toLocaleDateString('pt-BR')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {paciente.ultimaConsulta 
                      ? new Date(paciente.ultimaConsulta).toLocaleDateString('pt-BR')
                      : '-'}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {paciente.diagnosticoPrincipal || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setPacienteSelecionado(paciente)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Ver Prontuário
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Enviar Mensagem
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Agendar Consulta
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

      {/* Modal de Prontuário */}
      {pacienteSelecionado && (
        <Dialog open={!!pacienteSelecionado} onOpenChange={() => setPacienteSelecionado(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Prontuário - {pacienteSelecionado.nome}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome Completo</label>
                  <Input
                    value={pacienteSelecionado.nome}
                    onChange={(e) => {
                      const updated = pacientes.map(p =>
                        p.id === pacienteSelecionado.id ? { ...p, nome: e.target.value } : p
                      );
                      updatePacientes(updated);
                      setPacienteSelecionado({ ...pacienteSelecionado, nome: e.target.value });
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  <Input
                    value={pacienteSelecionado.telefone}
                    onChange={(e) => {
                      const updated = pacientes.map(p =>
                        p.id === pacienteSelecionado.id ? { ...p, telefone: e.target.value } : p
                      );
                      updatePacientes(updated);
                      setPacienteSelecionado({ ...pacienteSelecionado, telefone: e.target.value });
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={pacienteSelecionado.email}
                    onChange={(e) => {
                      const updated = pacientes.map(p =>
                        p.id === pacienteSelecionado.id ? { ...p, email: e.target.value } : p
                      );
                      updatePacientes(updated);
                      setPacienteSelecionado({ ...pacienteSelecionado, email: e.target.value });
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Diagnóstico Principal</label>
                  <Input
                    value={pacienteSelecionado.diagnosticoPrincipal || ''}
                    onChange={(e) => {
                      const updated = pacientes.map(p =>
                        p.id === pacienteSelecionado.id ? { ...p, diagnosticoPrincipal: e.target.value } : p
                      );
                      updatePacientes(updated);
                      setPacienteSelecionado({ ...pacienteSelecionado, diagnosticoPrincipal: e.target.value });
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Notas Clínicas</label>
                <textarea
                  className="w-full min-h-[200px] p-3 border rounded-md bg-background"
                  value={pacienteSelecionado.prontuario.notasClinicas}
                  onChange={(e) => {
                    const updated = pacientes.map(p =>
                      p.id === pacienteSelecionado.id 
                        ? { ...p, prontuario: { ...p.prontuario, notasClinicas: e.target.value } }
                        : p
                    );
                    updatePacientes(updated);
                    setPacienteSelecionado({
                      ...pacienteSelecionado,
                      prontuario: { ...pacienteSelecionado.prontuario, notasClinicas: e.target.value }
                    });
                  }}
                  placeholder="Digite as notas clínicas do paciente..."
                />
              </div>

              <Button
                onClick={() => {
                  const updated = pacientes.map(p =>
                    p.id === pacienteSelecionado.id
                      ? {
                          ...p,
                          prontuario: {
                            ...p.prontuario,
                            resumoIA: '📝 Resumo gerado automaticamente:\n\nPaciente em acompanhamento regular. Evolução positiva observada nas últimas sessões. Recomenda-se continuidade do tratamento conforme plano estabelecido.'
                          }
                        }
                      : p
                  );
                  updatePacientes(updated);
                  setPacienteSelecionado({
                    ...pacienteSelecionado,
                    prontuario: {
                      ...pacienteSelecionado.prontuario,
                      resumoIA: '📝 Resumo gerado automaticamente:\n\nPaciente em acompanhamento regular. Evolução positiva observada nas últimas sessões. Recomenda-se continuidade do tratamento conforme plano estabelecido.'
                    }
                  });
                }}
                className="w-full"
              >
                Gerar Resumo Pós-consulta (IA)
              </Button>

              {pacienteSelecionado.prontuario.resumoIA && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">
                    {pacienteSelecionado.prontuario.resumoIA}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
