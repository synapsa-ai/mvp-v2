import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/professionals/context/AppContext';

import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

export const Configuracoes = () => {
  const { perfil, setPerfil, tema, toggleTema, valorPadraoConsulta, updateValorPadraoConsulta } = useApp();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">
          Personalize sua experiência no Synapsa CRM
        </p>
      </div>

      {/* Perfil e Preferências */}
      <Card>
        <CardHeader>
          <CardTitle>Perfil e Preferências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-3 block">Perfil Ativo</label>
            <div className="flex gap-2">
              <Button
                variant={perfil === 'agente' ? 'default' : 'outline'}
                onClick={() => setPerfil('agente')}
              >
                Agente
              </Button>
              <Button
                variant={perfil === 'secretaria' ? 'default' : 'outline'}
                onClick={() => setPerfil('secretaria')}
              >
                Secretária
              </Button>
              <Button
                variant={perfil === 'gestor' ? 'default' : 'outline'}
                onClick={() => setPerfil('gestor')}
              >
                Gestor
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Perfil atual: <Badge>{perfil === 'agente' ? 'Agente' : perfil === 'secretaria' ? 'Secretária' : 'Gestor'}</Badge>
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Tema</p>
              <p className="text-sm text-muted-foreground">
                Alternar entre modo claro e escuro
              </p>
            </div>
            <Switch
              checked={tema === 'dark'}
              onCheckedChange={toggleTema}
            />
          </div>
        </CardContent>
      </Card>

      {/* Configurações Financeiras */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações Financeiras</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="valorPadrao">Valor Padrão da Consulta (R$)</Label>
            <Input
              id="valorPadrao"
              type="number"
              step="0.01"
              value={valorPadraoConsulta}
              onChange={(e) => {
                updateValorPadraoConsulta(Number(e.target.value));
                toast({ title: '✓ Valor padrão atualizado', duration: 1500 });
              }}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Este valor será usado automaticamente ao marcar consultas como pagas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Integrações */}
      <Card>
        <CardHeader>
          <CardTitle>Integrações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">WhatsApp</p>
              <p className="text-sm text-muted-foreground">
                Envio de mensagens via deeplink
              </p>
            </div>
            <Badge className="bg-green-500/10 text-green-700">
              Ativo
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Gmail</p>
              <p className="text-sm text-muted-foreground">
                Envio de emails via mailto
              </p>
            </div>
            <Badge className="bg-green-500/10 text-green-700">
              Ativo
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Google Calendar</p>
              <p className="text-sm text-muted-foreground">
                Sincronização de agenda (simulada)
              </p>
            </div>
            <Badge className="bg-green-500/10 text-green-700">
              Ativo
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Permissões */}
      <Card>
        <CardHeader>
          <CardTitle>Permissões</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Modo Gestor</p>
              <p className="text-sm text-muted-foreground">
                Habilitar exportação de relatórios
              </p>
            </div>
            <Switch checked={perfil === 'gestor'} disabled />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificações</p>
              <p className="text-sm text-muted-foreground">
                Alertas e lembretes do sistema
              </p>
            </div>
            <Switch checked={true} />
          </div>
        </CardContent>
      </Card>

      {/* Tema Synapsa */}
      <Card>
        <CardHeader>
          <CardTitle>Cores do Tema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="h-16 w-full rounded-lg bg-primary mb-2" />
              <p className="text-xs font-medium">Lilás Primário</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-full rounded-lg bg-secondary mb-2" />
              <p className="text-xs font-medium">Menta Accent</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-full rounded-lg bg-synapsa-dark mb-2" />
              <p className="text-xs font-medium">Azul Escuro</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sobre */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre o Synapsa CRM</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Versão: 1.0.0</p>
          <p>Módulo: Profissional de Saúde Mental</p>
          <p>Desenvolvido com React, TypeScript e Tailwind CSS</p>
          <p>Armazenamento: Local Storage (navegador)</p>
        </CardContent>
      </Card>
    </div>
  );
};
