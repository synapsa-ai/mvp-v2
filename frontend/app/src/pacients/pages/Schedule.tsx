// src/pacients/pages/Schedule.tsx
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export default function Schedule() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {/* esse /home aqui é mais decorativo; depois podemos trocar por onNavigate se quiser */}
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Calendário</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-start gap-6 flex-wrap">
        <Card className="w-full lg:w-[360px]">
          <CardHeader>
            <CardTitle>Selecionar data</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-[300px]">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Suas consultas</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">Reagendar</Button>
              <Button>Nova consulta</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="day" className="w-full">
              <TabsList>
                <TabsTrigger value="day">Dia</TabsTrigger>
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="month">Mês</TabsTrigger>
              </TabsList>
              <TabsContent value="day" className="pt-4">
                Sua visão do dia vai aqui.
              </TabsContent>
              <TabsContent value="week" className="pt-4">
                Sua visão da semana vai aqui.
              </TabsContent>
              <TabsContent value="month" className="pt-4">
                Sua visão do mês vai aqui.
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
