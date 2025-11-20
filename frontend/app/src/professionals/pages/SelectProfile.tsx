import { UserCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/professionals/context/AppContext';

interface SelectProfileProps {
  onComplete: () => void;
}

export const SelectProfile = ({ onComplete }: SelectProfileProps) => {
  const { setPerfil } = useApp();

  const handleSelectPerfil = (perfil: 'agente' | 'secretaria') => {
    setPerfil(perfil);
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary mb-4">
            <span className="text-3xl font-bold text-white">S</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Synapsa CRM</h1>
          <p className="text-muted-foreground">Módulo do Profissional</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 hover:border-primary"
            onClick={() => handleSelectPerfil('agente')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Agente</CardTitle>
              <CardDescription>Profissional de Saúde Mental</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Acesso completo a pacientes e prontuários</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Gestão da agenda e consultas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Relatórios e métricas profissionais</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Assistente IA para resumos clínicos</span>
                </li>
              </ul>
              <Button className="w-full mt-6" size="lg">
                Entrar como Agente
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 hover:border-secondary"
            onClick={() => handleSelectPerfil('secretaria')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle className="text-2xl">Secretária</CardTitle>
              <CardDescription>Gestão Administrativa</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-secondary">✓</span>
                  <span>Cadastro e gestão de pacientes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">✓</span>
                  <span>Agendamento e confirmação de consultas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">✓</span>
                  <span>Envio de mensagens e lembretes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary">✓</span>
                  <span>Gestão financeira básica</span>
                </li>
              </ul>
              <Button className="w-full mt-6 bg-secondary hover:bg-secondary/90" size="lg">
                Entrar como Secretária
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
