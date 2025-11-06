import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RoleSelect = () => {
  const navigate = useNavigate();

  const selectRole = (role: "patient" | "doctor") => {
    localStorage.setItem("userRole", role);
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-3">
          Welcome to Synapsa.ai
        </h1>
        <p className="text-muted-foreground text-center mb-12 text-lg">
          Choose how you'd like to continue
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 shadow-elevated hover:scale-105 transition-smooth cursor-pointer" onClick={() => selectRole("patient")}>
            <div className="text-center">
              <span className="material-symbols-rounded text-6xl text-primary mb-4 block">
                person
              </span>
              <h2 className="text-2xl font-heading font-semibold mb-3">I'm a Patient</h2>
              <p className="text-muted-foreground mb-6">
                Monitor your emotional well-being with AI-powered voice analysis
              </p>
              <Button className="w-full" size="lg">
                Continue as Patient
              </Button>
            </div>
          </Card>

          <Card className="p-8 shadow-elevated hover:scale-105 transition-smooth cursor-pointer" onClick={() => selectRole("doctor")}>
            <div className="text-center">
              <span className="material-symbols-rounded text-6xl text-secondary mb-4 block">
                medical_services
              </span>
              <h2 className="text-2xl font-heading font-semibold mb-3">I'm a Doctor</h2>
              <p className="text-muted-foreground mb-6">
                Access clinical tools and AI insights for patient care
              </p>
              <Button variant="secondary" className="w-full" size="lg">
                Continue as Doctor
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
