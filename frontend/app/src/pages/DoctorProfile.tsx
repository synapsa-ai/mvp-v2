import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function DoctorProfile() {
  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink to="/home">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Perfil</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="max-w-xl">
        <CardHeader><CardTitle>Dados do profissional</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input placeholder="Dr(a). Nome" />
          </div>
          <div className="space-y-2">
            <Label>Especialidade</Label>
            <Input placeholder="Ex.: Clínica Médica" />
          </div>
          <div className="space-y-2">
            <Label>CRM/CPF</Label>
            <Input placeholder="Documento" />
          </div>
          <Button>Salvar</Button>
        </CardContent>
      </Card>
    </div>
  );
}
