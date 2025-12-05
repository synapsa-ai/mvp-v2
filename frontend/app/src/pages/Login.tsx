// app/src/pages/Login.tsx
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Role = "patient" | "doctor" | null;

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>(null);
  const [name, setName] = useState("");
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

    // lógica de login aqui...

    if (role === "patient") {
      navigate("/pacients");
    } else if (role === "doctor") {
      navigate("/professional");
    } else {
      navigate("/role-select");
    }
  };

  const title =
    role === "patient"
      ? "Entrar como paciente"
      : role === "doctor"
      ? "Entrar como profissional"
      : "Faça login para continuar";

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-elevated">
          <h1 className="text-2xl font-heading font-semibold mb-2 text-center">
            {title}
          </h1>
          <p className="text-muted-foreground text-center mb-6 text-sm">
            Use seu nome de acesso e senha para continuar.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Seu nome de acesso"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Entrar
            </Button>
          </form>

          {/* Links embaixo */}
          <div className="mt-6 flex flex-col items-center gap-2 text-sm">
            {/* Criar conta só aparece se tiver role */}
            {role === "doctor" && (
              <Link
                to="/register"
                className="text-primary hover:underline"
              >
                Criar conta profissional
              </Link>
            )}

            {role === "patient" && (
              <Link
                to="/register"
                className="text-primary hover:underline"
              >
                Criar conta de paciente
              </Link>
            )}

            <Link
              to="/forgot-password"
              className="text-muted-foreground hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
