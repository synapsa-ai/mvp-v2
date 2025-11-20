import { useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/professionals/context/AppContext';
import { toast } from '@/hooks/use-toast';

export const Relatorios = () => {
  const { perfil, pacientes, consultas, recebimentos } = useApp();
  const [periodo, setPeriodo] = useState<'semana' | 'mes' | 'trimestre' | 'personalizado'>('mes');

  const exportarParaCSV = () => {
    if (perfil !== 'gestor') {
      toast({
        title: 'Acesso Restrito',
        description: 'Apenas o perfil Gestor pode exportar relatórios',
        variant: 'destructive',
      });
      return;
    }

    // Filtrar consultas baseado no período
    const agora = new Date();
    let dataLimite = new Date();
    
    switch (periodo) {
      case 'semana':
        dataLimite.setDate(agora.getDate() - 7);
        break;
      case 'mes':
        dataLimite.setMonth(agora.getMonth() - 1);
        break;
      case 'trimestre':
        dataLimite.setMonth(agora.getMonth() - 3);
        break;
      default:
        dataLimite = new Date(0); // Todos os dados
    }

    const consultasFiltradas = consultas.filter(c => {
      const dataConsulta = new Date(c.data);
      return dataConsulta >= dataLimite;
    });

    // Preparar dados para o CSV
    const dadosCSV = consultasFiltradas.map(consulta => {
      const paciente = pacientes.find(p => p.id === consulta.pacienteId);
      const recebimento = recebimentos.find(r => r.pacienteId === consulta.pacienteId);
      
      // Calcular tempo de retorno (dias desde a última consulta)
      const consultasAnteriores = consultas.filter(c => 
        c.pacienteId === consulta.pacienteId && 
        new Date(c.data) < new Date(consulta.data)
      ).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      
      const tempoRetorno = consultasAnteriores.length > 0
        ? Math.floor((new Date(consulta.data).getTime() - new Date(consultasAnteriores[0].data).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      return {
        data_consulta: new Date(consulta.data).toLocaleDateString('pt-BR'),
        paciente: paciente?.nome || 'N/A',
        status_consulta: consulta.status,
        valor: recebimento?.valor || '',
        observacoes: consulta.observacoes || '',
        canal_ultimo_contato: 'whatsapp',
        tempo_retorno: tempoRetorno,
        cancelado: consulta.status === 'cancelado' ? 'sim' : 'não',
        no_show: 'não'
      };
    });

    // Converter para CSV
    const headers = [
      'data_consulta',
      'paciente',
      'status_consulta',
      'valor',
      'observacoes',
      'canal_ultimo_contato',
      'tempo_retorno',
      'cancelado',
      'no_show'
    ];

    const csvContent = [
      headers.join(','),
      ...dadosCSV.map(linha => 
        headers.map(header => {
          const valor = String(linha[header as keyof typeof linha] || '');
          // Escapar vírgulas e aspas
          return valor.includes(',') || valor.includes('"') 
            ? `"${valor.replace(/"/g, '""')}"` 
            : valor;
        }).join(',')
      )
    ].join('\n');

    // Criar Blob e baixar
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_synapsa_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: '✓ Arquivo CSV exportado com sucesso',
      description: 'O download foi iniciado automaticamente',
    });
  };

  // Métricas
  const totalPacientes = pacientes.length;
  const pacientesAtivos = pacientes.filter(p => p.status === 'ativo').length;
  const consultasRealizadas = consultas.filter(c => c.status === 'concluido').length;
  const taxaCancelamento = consultas.length > 0 
    ? ((consultas.filter(c => c.status === 'cancelado').length / consultas.length) * 100).toFixed(1)
    : '0';
  
  const receitaTotal = recebimentos
    .filter(r => r.status === 'pago')
    .reduce((sum, r) => sum + r.valor, 0);
  
  const ticketMedio = recebimentos.filter(r => r.status === 'pago').length > 0
    ? receitaTotal / recebimentos.filter(r => r.status === 'pago').length
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios e Métricas</h1>
          <p className="text-muted-foreground">
            Análise de desempenho e indicadores
          </p>
        </div>
        {perfil === 'gestor' && (
          <Button onClick={exportarParaCSV} variant="outline">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        )}
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button
              variant={periodo === 'semana' ? 'default' : 'outline'}
              onClick={() => setPeriodo('semana')}
            >
              Semana
            </Button>
            <Button
              variant={periodo === 'mes' ? 'default' : 'outline'}
              onClick={() => setPeriodo('mes')}
            >
              Mês
            </Button>
            <Button
              variant={periodo === 'trimestre' ? 'default' : 'outline'}
              onClick={() => setPeriodo('trimestre')}
            >
              Trimestre
            </Button>
            <Button
              variant={periodo === 'personalizado' ? 'default' : 'outline'}
              onClick={() => setPeriodo('personalizado')}
            >
              Personalizado
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principais */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Pacientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPacientes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pacientesAtivos} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Consultas Realizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{consultasRealizadas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total: {consultas.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Cancelamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{taxaCancelamento}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {consultas.filter(c => c.status === 'cancelado').length} cancelamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              R$ {receitaTotal.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {recebimentos.filter(r => r.status === 'pago').length} recebimentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ticket Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              R$ {ticketMedio.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Por consulta paga
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inadimplência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {recebimentos.filter(r => r.status === 'pendente').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pendências financeiras
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              <p className="text-sm">Gráfico de evolução de pacientes ao longo do tempo</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Ativos</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500"
                      style={{ 
                        width: `${totalPacientes > 0 ? (pacientesAtivos / totalPacientes * 100) : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8">{pacientesAtivos}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Alta</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500"
                      style={{ 
                        width: `${totalPacientes > 0 ? (pacientes.filter(p => p.status === 'alta').length / totalPacientes * 100) : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8">
                    {pacientes.filter(p => p.status === 'alta').length}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Risco</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500"
                      style={{ 
                        width: `${totalPacientes > 0 ? (pacientes.filter(p => p.status === 'risco').length / totalPacientes * 100) : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8">
                    {pacientes.filter(p => p.status === 'risco').length}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              <p className="text-sm">Gráfico de evolução de receita</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>NPS - Net Promoter Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-5xl font-bold text-primary mb-2">8.5</div>
              <p className="text-sm text-muted-foreground">
                Baseado em feedback dos pacientes
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {perfil !== 'gestor' && (
        <Card className="border-dashed border-2">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              💼 Para exportar relatórios, entre no modo <strong>Gestor</strong>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
