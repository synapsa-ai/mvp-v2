import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/professionals/context/AppContext';

import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

export const Configuracoes = () => {
  const {
    perfil,
    setPerfil,
    tema,
    toggleTema,
    valorPadraoConsulta,
    updateValorPadraoConsulta,
  } = useApp();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">
          Personalize sua experiência no Synapsa CRM para sua prática em Saúde Mental.
        </p>
      </div>

      {/* Perfil e Preferências */}
      <Card>
        <CardHeader>
          <CardTitle>Perfil e Preferências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Modo de uso da plataforma */}
          <div>
            <label className="text-sm font-medium mb-3 block">Modo de uso</label>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={perfil === 'agente' ? 'default' : 'outline'}
                onClick={() => setPerfil('agente')}
              >
                Atendimento (Psicólogo)
              </Button>
              <Button
                variant={perfil === 'secretaria' ? 'default' : 'outline'}
                onClick={() => setPerfil('secretaria')}
              >
                Secretaria / Assistente
              </Button>
              <Button
                variant={perfil === 'gestor' ? 'default' : 'outline'}
                onClick={() => setPerfil('gestor')}
              >
                Gestão da Clínica
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Perfil atual:{' '}
              <Badge>
                {perfil === 'agente'
                  ? 'Atendimento (Psicólogo)'
                  : perfil === 'secretaria'
                  ? 'Secretaria / Assistente'
                  : 'Gestão da Clínica'}
              </Badge>
            </p>
          </div>

          {/* Tema */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Tema</p>
              <p className="text-sm text-muted-foreground">
                Alternar entre modo claro e escuro
              </p>
            </div>
            <Switch checked={tema === 'dark'} onCheckedChange={toggleTema} />
          </div>

          {/* Idioma / Localidade (apenas informativo, pode ser expandido depois) */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Idioma e localidade</p>
              <p className="text-sm text-muted-foreground">
                Configurações otimizadas para profissionais do Brasil (pt-BR).
              </p>
            </div>
            <Badge variant="outline">pt-BR</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Dados profissionais do Psicólogo */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Profissionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nomeProfissional">Nome profissional</Label>
              <Input
                id="nomeProfissional"
                placeholder="Ex.: Dr(a). João Silva"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="crp">CRP</Label>
              <Input
                id="crp"
                placeholder="Ex.: 00/00000"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="abordagem">Abordagem / Linha teórica</Label>
              <Input
                id="abordagem"
                placeholder="Ex.: TCC, Psicanálise, Humanista..."
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="registroExtra">Registro extra / especializações</Label>
              <Input
                id="registroExtra"
                placeholder="Ex.: Especialista em Psicologia Clínica"
                className="mt-2"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Estes dados são exibidos nos documentos gerados (comprovantes, relatórios, recibos, etc.).
            Integração completa pode ser feita posteriormente com o backend / contexto global.
          </p>
        </CardContent>
      </Card>

      {/* Preferências de Atendimento */}
      <Card>
        <CardHeader>
          <CardTitle>Preferências de Atendimento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duracaoConsulta">Duração padrão da consulta (min)</Label>
              <Input
                id="duracaoConsulta"
                type="number"
                placeholder="50"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="intervaloConsulta">
                Intervalo entre consultas (min)
              </Label>
              <Input
                id="intervaloConsulta"
                type="number"
                placeholder="10"
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Atendimentos online</p>
              <p className="text-sm text-muted-foreground">
                Indica se você realiza atendimentos à distância (plataforma de vídeo).
              </p>
            </div>
            <Switch
              checked={true}
              onCheckedChange={() => {
                /* placeholder – integrar depois */
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Atendimentos presenciais</p>
              <p className="text-sm text-muted-foreground">
                Indica se você atende em consultório físico.
              </p>
            </div>
            <Switch
              checked={true}
              onCheckedChange={() => {
                /* placeholder – integrar depois */
              }}
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
            <Label htmlFor="valorPadrao">Valor médio da Consulta (R$)</Label>
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
              Este valor será usado automaticamente ao marcar consultas. Você
              ainda poderá personalizar o valor por paciente, convênio ou tipo
              de serviço.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="politicaCancelamento">
                Política de cancelamento (informativo)
              </Label>
              <Input
                id="politicaCancelamento"
                placeholder="Ex.: cancelamentos em menos de 24h são cobrados integralmente."
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="formasPagamento">Formas de pagamento aceitas</Label>
              <Input
                id="formasPagamento"
                placeholder="Ex.: PIX, Débito, Crédito, Dinheiro"
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comunicação e Notificações */}
      <Card>
        <CardHeader>
          <CardTitle>Comunicação e Notificações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Lembretes de consulta para pacientes</p>
              <p className="text-sm text-muted-foreground">
                Envio de lembretes via WhatsApp / e-mail utilizando deeplink.
              </p>
            </div>
            <Switch
              checked={true}
              onCheckedChange={() => {
                /* placeholder – integrar depois */
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificações para o profissional</p>
              <p className="text-sm text-muted-foreground">
                Avisos de novas consultas, reagendamentos e cancelamentos.
              </p>
            </div>
            <Switch
              checked={true}
              onCheckedChange={() => {
                /* placeholder – integrar depois */
              }}
            />
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
                Envio de mensagens e lembretes via deeplink.
              </p>
            </div>
            <Badge className="bg-green-500/10 text-green-700">Ativo</Badge>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Gmail</p>
              <p className="text-sm text-muted-foreground">
                Envio de e-mails via mailto (confirmação de consulta, relatórios, etc.).
              </p>
            </div>
            <Badge className="bg-green-500/10 text-green-700">Ativo</Badge>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Google Calendar</p>
              <p className="text-sm text-muted-foreground">
                Sincronização de agenda (simulada) para visualização de compromissos.
              </p>
            </div>
            <Badge className="bg-green-500/10 text-green-700">Ativo</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Privacidade e Segurança */}
      <Card>
        <CardHeader>
          <CardTitle>Privacidade e Segurança</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            • Os dados dos pacientes devem ser tratados conforme o código de ética da
            Psicologia e a LGPD.
          </p>
          <p>
            • Evite registrar informações sensíveis desnecessárias nas observações da sessão.
          </p>
          <p>
            • Utilize senhas fortes e não compartilhe seu acesso com terceiros.
          </p>
        </CardContent>
      </Card>

      {/* Sobre */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre o Synapsa CRM</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Versão: 1.0.0</p>
          <p>Módulo: Profissional de Saúde Mental (Psicólogo)</p>
          <p>Desenvolvido com React, TypeScript e Tailwind CSS</p>
          <p>Armazenamento: Local Storage (navegador)</p>
        </CardContent>
      </Card>
    </div>
  );
};
