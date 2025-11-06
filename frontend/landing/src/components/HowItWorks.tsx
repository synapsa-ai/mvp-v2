import { Mic, BarChart3, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: Mic,
    title: "Análise de Voz Inteligente",
    description: "Identifica padrões emocionais e cognitivos através da análise avançada de voz e linguagem.",
  },
  {
    icon: BarChart3,
    title: "Painel Clínico Preditivo",
    description: "Visão integrada e completa da jornada do paciente com insights acionáveis.",
  },
  {
    icon: AlertTriangle,
    title: "Alertas Antecipados",
    description: "IA que prevê agravamentos antes da crise, permitindo intervenção precoce.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="solucao" className="py-24 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Como funciona</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tecnologia de ponta para potencializar o cuidado em saúde mental
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-medium group animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
