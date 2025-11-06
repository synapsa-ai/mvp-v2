import { Clock, Target, MessageSquare } from "lucide-react";

const metrics = [
  {
    icon: Clock,
    value: "29%",
    label: "Reduz tempo clínico",
  },
  {
    icon: Target,
    value: "66%",
    label: "Melhora acurácia",
  },
  {
    icon: MessageSquare,
    value: "45%",
    label: "Aumenta engajamento",
  },
];

export const Benefits = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Benefícios Reais</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Resultados comprovados que transformam a prática clínica
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div 
                key={index} 
                className="text-center p-8 rounded-2xl bg-accent/50 hover:bg-accent transition-colors duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-6">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {metric.value}
                </div>
                <div className="text-lg text-muted-foreground">{metric.label}</div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xl font-medium text-foreground max-w-3xl mx-auto">
          A Synapsa não substitui o profissional —{" "}
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            ela amplifica seu impacto.
          </span>
        </p>
      </div>
    </section>
  );
};
