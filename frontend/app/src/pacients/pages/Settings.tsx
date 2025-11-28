// src/pacients/pages/Settings.tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <div className="space-y-8 pb-10">
      {/* Breadcrumb original */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Configurações</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Preferências */}
      <Card className="max-w-xl shadow-sm rounded-2xl border-muted">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Preferências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-1">
            <Label htmlFor="notif" className="text-sm font-medium">Notificações</Label>
            <Switch id="notif" />
          </div>

          <div className="flex items-center justify-between py-1">
            <Label htmlFor="dark" className="text-sm font-medium">Tema escuro</Label>
            <Switch id="dark" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Dados da conta */}
      <Card className="max-w-xl shadow-sm rounded-2xl border-muted">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Dados da Conta</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              placeholder="Seu nome"
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tel">Telefone</Label>
            <Input
              id="tel"
              placeholder="(XX) XXXXX-XXXX"
              className="rounded-lg"
            />
          </div>

          <Button className="w-full rounded-lg">
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card className="max-w-xl shadow-sm rounded-2xl border-muted">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Segurança</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full rounded-lg">
            Alterar Senha
          </Button>
        </CardContent>
      </Card>

      {/* Privacidade */}
      <Card className="max-w-xl shadow-sm rounded-2xl border-muted">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Privacidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full rounded-lg">
            Baixar meus dados
          </Button>

          <Button variant="destructive" className="w-full rounded-lg">
            Excluir minha conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
