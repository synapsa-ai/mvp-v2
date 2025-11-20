import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/professionals/context/AppContext';
import { Users, Calendar, TrendingUp, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { perfil, pacientes, consultas, recebimentos } = useApp();

  // Métricas do Agente
  const pacientesAtivos = pacientes.filter(p => p.status === 'ativo').length;
  const consultasHoje = consultas.filter(c => {
    const hoje = new Date().toISOString().split('T')[0];
    return c.data === hoje;
  }).length;
  
  const consultasEsteMes = consultas.filter(c => {
    const dataConsulta = new Date(c.data);
    const hoje = new Date();
    return dataConsulta.getMonth() === hoje.getMonth() && 
           dataConsulta.getFullYear() === hoje.getFullYear();
  }).length;

  const receitaMes = recebimentos
    .filter(r => {
      const dataRec = new Date(r.data);
      const hoje = new Date();
      return dataRec.getMonth() === hoje.getMonth() && 
             dataRec.getFullYear() === hoje.getFullYear() &&
             r.status === 'pago';
    })
    .reduce((sum, r) => sum + r.valor, 0);

  const pacientesRisco = pacientes.filter(p => p.status === 'risco').length;

  if (perfil === 'agente') {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard do Agente</h1>
          <p className="text-muted-foreground">Visão geral da sua prática profissional</p>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pacientes Ativos
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pacientesAtivos}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total: {pacientes.length} pacientes
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Consultas Hoje
              </CardTitle>
              <Calendar className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{consultasHoje}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Mês: {consultasEsteMes} consultas
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Receita do Mês
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                R$ {receitaMes.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {recebimentos.filter(r => r.status === 'pago').length} recebimentos
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pacientes em Risco
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pacientesRisco}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Requerem atenção especial
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cards de Ação */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => onNavigate('pacientes')}
              >
                <Users className="mr-2 h-4 w-4" />
                Cadastrar Novo Paciente
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => onNavigate('agenda')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Agendar Consulta
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => onNavigate('assistenteIA')}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Abrir Assistente IA
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximas Consultas</CardTitle>
            </CardHeader>
            <CardContent>
              {consultasHoje === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma consulta agendada para hoje.
                </p>
              ) : (
                <div className="space-y-3">
                  {consultas
                    .filter(c => {
                      const hoje = new Date().toISOString().split('T')[0];
                      return c.data === hoje;
                    })
                    .slice(0, 3)
                    .map(c => (
                      <div key={c.id} className="flex items-center gap-3 p-2 rounded border">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{c.pacienteNome}</p>
                          <p className="text-xs text-muted-foreground">{c.hora}</p>
                        </div>
                        <Button size="sm" variant="ghost">Ver</Button>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Estado Vazio */}
        {pacientes.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-16 w-16 text-muted-foreground/20 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Comece cadastrando pacientes</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
                Cadastre seu primeiro paciente para começar a usar o Synapsa CRM
              </p>
              <Button onClick={() => onNavigate('pacientes')}>
                Cadastrar Primeiro Paciente
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Dashboard da Secretária
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard da Secretária</h1>
        <p className="text-muted-foreground">Gestão administrativa e operacional</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Pacientes
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pacientes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Consultas Hoje
            </CardTitle>
            <Calendar className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{consultasHoje}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendências Financeiras
            </CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {recebimentos.filter(r => r.status === 'pendente').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Consultas Este Mês
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{consultasEsteMes}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onNavigate('pacientes')}
            >
              <Users className="mr-2 h-4 w-4" />
              Cadastrar Paciente
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onNavigate('agenda')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Agendar Consulta
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onNavigate('mensagens')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Enviar Lembretes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tarefas do Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Confirmar consultas agendadas para hoje
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
