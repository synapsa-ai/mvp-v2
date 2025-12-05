import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/professionals/context/AppContext";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useRef } from "react";

export const Configuracoes = () => {
  const {
    tema,
    toggleTema,

    nomeProfissional,
    crp,
    abordagem,
    registroExtra,
    fotoProfissional,

    updateNomeProfissional,
    updateCRP,
    updateAbordagem,
    updateRegistroExtra,
    updateFotoProfissional,

    valorPadraoConsulta,
    updateValorPadraoConsulta,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadFoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateFotoProfissional(reader.result as string);
      toast({ title: "✓ Foto atualizada com sucesso", duration: 1500 });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">
          Personalize sua experiência na Synapsa.ai e mantenha seus dados profissionais atualizados.
        </p>
      </div>

      {/* DADOS PROFISSIONAIS */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Profissionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* FOTO PROFISSIONAL */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-muted overflow-hidden border">
              {fotoProfissional ? (
                <img
                  src={fotoProfissional}
                  alt="Foto profissional"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-sm text-muted-foreground">
                  Sem foto
                </div>
              )}
            </div>
            <div>
              <Button onClick={() => fileInputRef.current?.click()}>
                Enviar Foto
              </Button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleUploadFoto}
              />
              <p className="text-xs text-muted-foreground mt-2">
                A foto será usada em documentos gerados pela Synapsa.ai.
              </p>
            </div>
          </div>

          {/* CAMPOS PROFISSIONAIS */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Nome profissional</Label>
              <Input
                value={nomeProfissional}
                onChange={(e) => updateNomeProfissional(e.target.value)}
                placeholder="Ex.: Dr(a). João Silva"
                className="mt-2"
              />
            </div>

            <div>
              <Label>CRP</Label>
              <Input
                value={crp}
                onChange={(e) => updateCRP(e.target.value)}
                placeholder="Ex.: 00/00000"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Abordagem / Linha teórica</Label>
              <Input
                value={abordagem}
                onChange={(e) => updateAbordagem(e.target.value)}
                placeholder="Ex.: TCC, Psicanálise, Humanista..."
                className="mt-2"
              />
            </div>

            <div>
              <Label>Registro extra / especializações</Label>
              <Input
                value={registroExtra}
                onChange={(e) => updateRegistroExtra(e.target.value)}
                placeholder="Ex.: Especialista em Psicologia Clínica"
                className="mt-2"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Estes dados aparecem em relatórios, recibos e documentos gerados.
          </p>
        </CardContent>
      </Card>

      {/* APARÊNCIA */}
      <Card>
        <CardHeader>
          <CardTitle>Aparência e Tema</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="font-medium">Tema</p>
            <p className="text-sm text-muted-foreground">Modo claro/escuro</p>
          </div>
          <Switch checked={tema === "dark"} onCheckedChange={toggleTema} />
        </CardContent>
      </Card>

      {/* FINANCEIRO */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações Financeiras</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Valor médio da Consulta (R$)</Label>
            <Input
              type="number"
              step="0.01"
              value={valorPadraoConsulta}
              onChange={(e) => {
                updateValorPadraoConsulta(Number(e.target.value));
                toast({ title: "✓ Valor padrão atualizado", duration: 1500 });
              }}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Este valor é usado automaticamente ao marcar novas consultas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Política de cancelamento</Label>
              <Input placeholder="Ex.: Cancelamentos em menos de 24h são cobrados." className="mt-2" />
            </div>
            <div>
              <Label>Formas de pagamento aceitas</Label>
              <Input placeholder="Ex.: PIX, débito, crédito, dinheiro" className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* COMUNICAÇÃO */}
      <Card>
        <CardHeader>
          <CardTitle>Comunicação e Notificações</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Lembretes automáticos</p>
              <p className="text-sm text-muted-foreground">
                Envio manual ou automático via WhatsApp (deeplink).
              </p>
            </div>
            <Switch checked onCheckedChange={() => {}} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificações internas</p>
              <p className="text-sm text-muted-foreground">
                Alertas sobre reagendamentos, cancelamentos e novas consultas.
              </p>
            </div>
            <Switch checked onCheckedChange={() => {}} />
          </div>
        </CardContent>
      </Card>

      {/* INTEGRAÇÕES */}
      <Card>
        <CardHeader>
          <CardTitle>Integrações</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium">WhatsApp</p>
              <p className="text-sm text-muted-foreground">Mensagens e lembretes.</p>
            </div>
            <Badge className="bg-green-500/10 text-green-700">Ativo</Badge>
          </div>

          <div className="p-4 border rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium">Google Calendar</p>
              <p className="text-sm text-muted-foreground">Sincronização da agenda.</p>
            </div>
            <Badge className="bg-green-500/10 text-green-700">Ativo</Badge>
          </div>
        </CardContent>
      </Card>

      {/* PRIVACIDADE */}
      <Card>
        <CardHeader>
          <CardTitle>Privacidade e Segurança</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Dados sensíveis seguem o Código de Ética da Psicologia e LGPD.</p>
          <p>• Evite texto extremamente sensível nas observações de consulta.</p>
          <p>• Utilize senhas fortes e não compartilhe seu login.</p>
        </CardContent>
      </Card>
    </div>
  );
};
