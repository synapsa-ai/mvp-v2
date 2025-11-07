import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function Finance() {
  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink to="/home">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Financeiro</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-6 md:grid-cols-3">
        <Card><CardHeader><CardTitle>MRR</CardTitle></CardHeader><CardContent>R$ —</CardContent></Card>
        <Card><CardHeader><CardTitle>Receita</CardTitle></CardHeader><CardContent>R$ —</CardContent></Card>
        <Card><CardHeader><CardTitle>Churn</CardTitle></CardHeader><CardContent><Progress value={15} /></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Receita</CardTitle></CardHeader>
        <CardContent>
          <Tabs defaultValue="30d">
            <TabsList>
              <TabsTrigger value="7d">7 dias</TabsTrigger>
              <TabsTrigger value="30d">30 dias</TabsTrigger>
              <TabsTrigger value="12m">12 meses</TabsTrigger>
            </TabsList>
            <TabsContent value="30d" className="pt-4">Gráfico/serie vai aqui.</TabsContent>
            <TabsContent value="7d" className="pt-4">Gráfico 7d.</TabsContent>
            <TabsContent value="12m" className="pt-4">Gráfico 12m.</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
