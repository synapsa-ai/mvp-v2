// app/src/pages/Register.tsx
import { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Role = "patient" | "doctor" | null;

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [crp, setCrp] = useState(""); // só será usado se profissional
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as Role;
    setRole(storedRole);

    if (!storedRole) {
      navigate("/role-select", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      role,
      name,
      phone,
      email,
      password,
      crp: role === "doctor" ? crp : undefined,
    };

    // aqui entra a chamada de API de registro
    if (role === "doctor") {
      console.log("Registrando profissional:", payload);
      // ex: await api.post("/auth/register-professional", payload)
    } else {
      console.log("Registrando paciente:", payload);
      // ex: await api.post("/auth/register-patient", payload)
    }

    // Depois do registro bem-sucedido:
    navigate("/login");
  };

  const title =
    role === "doctor" ? "Criar conta profissional" : "Criar conta";

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-elevated">
          <h1 className="text-2xl font-heading font-semibold mb-2 text-center">
            {title}
          </h1>
          <p className="text-muted-foreground text-center mb-6 text-sm">
            Preencha seus dados para começar a usar a Synapsa.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(99) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {role === "doctor" && (
              <div>
                <Label htmlFor="crp">CRP</Label>
                <Input
                  id="crp"
                  placeholder="Seu número de CRP"
                  value={crp}
                  onChange={(e) => setCrp(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Crie uma senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Criar conta
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
