import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Chat() {
  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink to="/home">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Chat</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <Card>
          <CardHeader><CardTitle>Conversas</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {/* Placeholder de threads */}
            <div className="text-sm text-muted-foreground">Lista de conversas aparecerá aqui.</div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Thread atual</CardTitle>
            <Button variant="outline" size="sm">Nova conversa</Button>
          </CardHeader>
          <Separator />
          <CardContent className="flex-1 min-h-[360px] py-4">
            {/* Placeholder de mensagens */}
            <div className="text-sm text-muted-foreground">Mensagens da thread aparecerão aqui.</div>
          </CardContent>
          <div className="p-4 border-t flex gap-2">
            <Textarea placeholder="Digite sua mensagem..." className="min-h-[72px]" />
            <Button>Enviar</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
