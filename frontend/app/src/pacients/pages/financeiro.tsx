import { useParams } from "react-router-dom";
import { useApp } from "@/professionals/context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export const FinanceiroPaciente = () => {
  const { id } = useParams();
  const { pacientes, consultas, updateConsultas, valorPadraoConsulta } = useApp();

  const paciente = pacientes.find((p) => p.id === id);
  if (!paciente) return <p className="p-6">Paciente não encontrado.</p>;

  const consultasPaciente = consultas.filter((c) => c.pacienteId === paciente.id);

  // Marcar pagamento
  const marcarComoPago = (consultaId: string) => {
    updateConsultas(
      consultas.map((c) =>
        c.id === consultaId ? { ...c, pago: true } : c
      )
    );
    toast({ title: "✓ Pagamento registrado", duration: 1500 });
  };

  // Gerar link simulado
  const gerarLinkPagamento = (valor: number) => {
    const link = `https://pagamento.synapsa.ai/pay?valor=${valor}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "✓ Link de pagamento gerado",
      description: "O link foi copiado para sua área de transferência.",
    });
  };

  // Cálculos
  const totalPago = consultasPaciente
    .filter((c) => c.pago)
    .reduce((acc, c) => acc + (c.valor || valorPadraoConsulta), 0);

  const totalAReceber = consultasPaciente
    .filter((c) => !c.pago)
    .reduce((acc, c) => acc + (c.valor || valorPadraoConsulta), 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financeiro do Paciente</h1>
        <p className="text-muted-foreground">
          Histórico financeiro e cobrança do paciente {paciente.nome}.
        </p>
      </div>

      {/* Resumo */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo financeiro</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total pago</p>
            <p className="text-2xl font-bold text-green-600">
              R$ {totalPago.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">A receber</p>
            <p className="text-2xl font-bold text-red-600">
              R$ {totalAReceber.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Consultas totais</p>
            <p className="text-2xl font-bold">
              {consultasPaciente.length}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lista de consultas */}
      <Card>
        <CardHeader>
          <CardTitle>Consultas e pagamentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {consultasPaciente.length === 0 && (
            <p className="text-muted-foreground">Nenhuma consulta registrada.</p>
          )}

          {consultasPaciente.map((c) => (
            <div
              key={c.id}
              className="border rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">
                  {c.data} — {c.hora}
                </p>
                <p className="text-sm text-muted-foreground">
                  Valor: R$ {(c.valor || valorPadraoConsulta).toFixed(2)}
                </p>
                <Badge className={c.pago ? "bg-green-600" : "bg-red-600"}>
                  {c.pago ? "Pago" : "A pagar"}
                </Badge>
              </div>

              <div className="flex gap-2">
                {!c.pago && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() =>
                        gerarLinkPagamento(c.valor || valorPadraoConsulta)
                      }
                    >
                      Gerar link
                    </Button>

                    <Button onClick={() => marcarComoPago(c.id)}>
                      Marcar como pago
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
