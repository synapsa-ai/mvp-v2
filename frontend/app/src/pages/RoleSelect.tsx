import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RoleSelect = () => {
  const navigate = useNavigate();

  const selectRole = (role: "patient" | "doctor") => {
    localStorage.setItem("userRole", role);

    if (role === "patient") {
      navigate("/home");          // fluxo paciente
    } else {
      navigate("/professional");  // fluxo profissional (CRM)
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-3">
          Bem-vindo a Synapsa
        </h1>
        <p className="text-muted-foreground text-center mb-12 text-lg">
          Escolha como você quer continuar
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="p-8 shadow-elevated hover:scale-105 transition-smooth cursor-pointer"
            onClick={() => selectRole("patient")}
          >
            <div className="text-center">
              <span className="material-symbols-rounded text-6xl text-primary mb-4 block">
                person
              </span>
              <h2 className="text-2xl font-heading font-semibold mb-3">
                Paciente
              </h2>
              <p className="text-muted-foreground mb-6">
                Cuide das suas emoções e bem-estar com análise de voz assistida por IA
              </p>
              <Button className="w-full" size="lg">
                Continue como paciente
              </Button>
            </div>
          </Card>

          <Card
            className="p-8 shadow-elevated hover:scale-105 transition-smooth cursor-pointer"
            onClick={() => selectRole("doctor")}
          >
            <div className="text-center">
              <span className="material-symbols-rounded text-6xl text-secondary mb-4 block">
                medical_services
              </span>
              <h2 className="text-2xl font-heading font-semibold mb-3">
                Profissional
              </h2>
              <p className="text-muted-foreground mb-6">
                Acesse ferramentas clínicas e insights de IA para o cuidado do paciente
              </p>
              <Button variant="secondary" className="w-full" size="lg">
                Continue como profissional
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
