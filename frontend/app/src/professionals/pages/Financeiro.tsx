import { useState } from 'react';
import { Plus, DollarSign, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/professionals/context/AppContext';

import { Recebimento} from '@/professionals/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

export const Financeiro = () => {
  const { recebimentos, updateRecebimentos, pacientes } = useApp();
  const [modalNovo, setModalNovo] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [novoRecebimento, setNovoRecebimento] = useState<Partial<Recebimento>>({
    pacienteId: '',
    pacienteNome: '',
    data: new Date().toISOString().split('T')[0],
    valor: 0,
    formaPagamento: 'pix',
    status: 'pendente',
    observacoes: '',
  });

  const handleNovoRecebimento = () => {
    if (!novoRecebimento.pacienteId || !novoRecebimento.data || !novoRecebimento.valor) {
      toast({
        title: 'Atenção',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    const paciente = pacientes.find(p => p.id === novoRecebimento.pacienteId);
    if (!paciente) return;

    const novo: Recebimento = {
      id: Date.now().toString(),
      pacienteId: paciente.id,
      pacienteNome: paciente.nome,
      data: novoRecebimento.data!,
      valor: Number(novoRecebimento.valor),
      formaPagamento: novoRecebimento.formaPagamento!,
      status: novoRecebimento.status as 'pago' | 'pendente',
      observacoes: novoRecebimento.observacoes,
    };

    updateRecebimentos([...recebimentos, novo]);
    setModalNovo(false);
    setNovoRecebimento({
      pacienteId: '',
      pacienteNome: '',
      data: new Date().toISOString().split('T')[0],
      valor: 0,
      formaPagamento: 'pix',
      status: 'pendente',
      observacoes: '',
    });
    toast({ title: '✓ Lançamento adicionado' });
  };

  const handleEditarCampo = (id: string, campo: keyof Recebimento, valor: any) => {
    const atualizado = recebimentos.map(r => {
      if (r.id === id) {
        if (campo === 'pacienteId') {
          const paciente = pacientes.find(p => p.id === valor);
          return { ...r, pacienteId: valor, pacienteNome: paciente?.nome || r.pacienteNome };
        }
        return { ...r, [campo]: valor };
      }
      return r;
    });
    updateRecebimentos(atualizado);
    toast({ title: '✓ Alterações salvas', duration: 1500 });
  };

  const receitaMes = recebimentos
    .filter(r => {
      const dataRec = new Date(r.data);
      const hoje = new Date();
      return dataRec.getMonth() === hoje.getMonth() && 
             dataRec.getFullYear() === hoje.getFullYear() &&
             r.status === 'pago';
    })
    .reduce((sum, r) => sum + r.valor, 0);

  const recebimentosPagos = recebimentos.filter(r => r.status === 'pago');
  const ticketMedio = recebimentosPagos.length > 0
    ? recebimentosPagos.reduce((sum, r) => sum + r.valor, 0) / recebimentosPagos.length
    : 0;

  const pendentes = recebimentos.filter(r => r.status === 'pendente');
  const totalPendente = pendentes.reduce((sum, r) => sum + r.valor, 0);
  const percentualPendencia = recebimentos.length > 0
    ? (pendentes.length / recebimentos.length) * 100
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground">
            Gestão de recebimentos e pagamentos
          </p>
        </div>
        <Button onClick={() => setModalNovo(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Lançamento
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita do Mês
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              R$ {receitaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ticket Médio
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendências
            </CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {pendentes.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              % Pendência
            </CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {percentualPendencia.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Recebimentos */}
      {recebimentos.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <DollarSign className="h-12 w-12 text-muted-foreground/20 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum recebimento registrado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comece adicionando seu primeiro lançamento
            </p>
            <Button onClick={() => setModalNovo(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Lançamento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Forma de Pagamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recebimentos.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell className="font-medium">
                    {editandoId === rec.id ? (
                      <Select
                        value={rec.pacienteId}
                        onValueChange={(v) => handleEditarCampo(rec.id, 'pacienteId', v)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {pacientes.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      rec.pacienteNome
                    )}
                  </TableCell>
                  <TableCell>
                    {editandoId === rec.id ? (
                      <Input
                        type="date"
                        value={rec.data}
                        onChange={(e) => handleEditarCampo(rec.id, 'data', e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      new Date(rec.data).toLocaleDateString('pt-BR')
                    )}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {editandoId === rec.id ? (
                      <Input
                        type="number"
                        value={rec.valor}
                        onChange={(e) => handleEditarCampo(rec.id, 'valor', Number(e.target.value))}
                        className="h-8 w-32"
                      />
                    ) : (
                      `R$ ${rec.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    )}
                  </TableCell>
                  <TableCell className="capitalize">
                    {editandoId === rec.id ? (
                      <Select
                        value={rec.formaPagamento}
                        onValueChange={(v) => handleEditarCampo(rec.id, 'formaPagamento', v)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pix">PIX</SelectItem>
                          <SelectItem value="cartao">Cartão</SelectItem>
                          <SelectItem value="dinheiro">Dinheiro</SelectItem>
                          <SelectItem value="transferencia">Transferência</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      rec.formaPagamento
                    )}
                  </TableCell>
                  <TableCell>
                    {editandoId === rec.id ? (
                      <Select
                        value={rec.status}
                        onValueChange={(v) => handleEditarCampo(rec.id, 'status', v)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pago">Pago</SelectItem>
                          <SelectItem value="pendente">Pendente</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        className={
                          rec.status === 'pago'
                            ? 'bg-green-500/10 text-green-700'
                            : 'bg-orange-500/10 text-orange-700'
                        }
                      >
                        {rec.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {editandoId === rec.id ? (
                      <Input
                        value={rec.observacoes || ''}
                        onChange={(e) => handleEditarCampo(rec.id, 'observacoes', e.target.value)}
                        className="h-8"
                        placeholder="Observações"
                      />
                    ) : (
                      <span className="truncate block">{rec.observacoes || '-'}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditandoId(editandoId === rec.id ? null : rec.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Modal Novo Lançamento */}
      <Dialog open={modalNovo} onOpenChange={setModalNovo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Lançamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Paciente *</Label>
              <Select
                value={novoRecebimento.pacienteId}
                onValueChange={(v) => setNovoRecebimento({ ...novoRecebimento, pacienteId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent>
                  {pacientes.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data *</Label>
              <Input
                type="date"
                value={novoRecebimento.data}
                onChange={(e) => setNovoRecebimento({ ...novoRecebimento, data: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Valor (R$) *</Label>
              <Input
                type="number"
                step="0.01"
                value={novoRecebimento.valor}
                onChange={(e) => setNovoRecebimento({ ...novoRecebimento, valor: Number(e.target.value) })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Forma de Pagamento *</Label>
              <Select
                value={novoRecebimento.formaPagamento}
                onValueChange={(v) => setNovoRecebimento({ ...novoRecebimento, formaPagamento: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="cartao">Cartão</SelectItem>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status *</Label>
              <Select
                value={novoRecebimento.status}
                onValueChange={(v) => setNovoRecebimento({ ...novoRecebimento, status: v as 'pago' | 'pendente' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea
                value={novoRecebimento.observacoes}
                onChange={(e) => setNovoRecebimento({ ...novoRecebimento, observacoes: e.target.value })}
                placeholder="Informações adicionais..."
                rows={3}
              />
            </div>

            <Button onClick={handleNovoRecebimento} className="w-full">
              Salvar Lançamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
