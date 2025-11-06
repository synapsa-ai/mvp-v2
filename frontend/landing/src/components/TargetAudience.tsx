import { Stethoscope, Building2, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const audiences = [
  {
    icon: Stethoscope,
    title: "Profissionais de saúde mental",
    description: "Psicólogos, psiquiatras e neurologistas que buscam maior precisão diagnóstica e eficiência no atendimento.",
  },
  {
    icon: Building2,
    title: "Clínicas e hospitais",
    description: "Gestão inteligente de pacientes e eficiência operacional para instituições de saúde.",
  },
  {
    icon: User,
    title: "Pacientes",
    description: "Monitoramento remoto contínuo e maior segurança no acompanhamento terapêutico.",
  },
];

export const TargetAudience = () => {
  return (
    <section id="sobre" className="py-24 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Para quem é a Synapsa?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Soluções personalizadas para cada perfil na área de saúde mental
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {audiences.map((audience, index) => {
            const Icon = audience.icon;
            return (
              <Card 
                key={index}
                className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-medium group animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader className="space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{audience.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {audience.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
