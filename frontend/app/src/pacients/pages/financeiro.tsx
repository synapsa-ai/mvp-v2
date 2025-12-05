// src/pacients/pages/financeiro.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import {  } from "@/lib/api";

const FinanceiroPaciente = () => {
  // No futuro: buscar dados financeiros da API aqui
  // ex: const { data, isLoading } = useQuery(["financeiro", pacienteId], ...)

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold">Financeiro</h1>
        <p className="text-muted-foreground">
          Aqui você vai acompanhar seus pagamentos, cobranças e recibos.
        </p>
      </div>

      {/* Resumo (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Último pagamento</p>
            <p className="text-2xl font-bold">—</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Próxima cobrança</p>
            <p className="text-2xl font-bold">—</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Status da conta</p>
            <p className="text-2xl font-bold">Em análise</p>
          </div>
        </CardContent>
      </Card>

      {/* Lista de lançamentos (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de pagamentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Em breve você poderá ver aqui todos os pagamentos, faturas e
            recibos vinculados à sua conta.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceiroPaciente;
