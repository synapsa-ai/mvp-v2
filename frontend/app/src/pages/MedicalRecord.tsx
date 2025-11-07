import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MedicalRecord() {
  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink to="/home">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Hub / Pacientes</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex gap-2">
        <Input placeholder="Buscar paciente..." />
        <Button>Buscar</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Paciente</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">Selecione um paciente para ver detalhes.</div>
          <Tabs defaultValue="resumo">
            <TabsList>
              <TabsTrigger value="resumo">Resumo</TabsTrigger>
              <TabsTrigger value="evolucoes">Evoluções</TabsTrigger>
              <TabsTrigger value="arquivos">Arquivos</TabsTrigger>
              <TabsTrigger value="consentimento">Consentimento</TabsTrigger>
            </TabsList>
            <TabsContent value="resumo" className="pt-4">Resumo do paciente.</TabsContent>
            <TabsContent value="evolucoes" className="pt-4">Evoluções clínicas.</TabsContent>
            <TabsContent value="arquivos" className="pt-4">Uploads e documentos.</TabsContent>
            <TabsContent value="consentimento" className="pt-4">Status de consentimento.</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
