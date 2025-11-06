import { Button } from "@/components/ui/button";
import heroMockup from "@/assets/hero-mockup.jpg";
import { appHref } from "@/lib/appRoute";
export const Hero = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden pt-16">
      {/* Decorative blur elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Transformando{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                tecnologia + cuidado humano
              </span>{" "}
              em eficiência real na saúde mental.
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              IA que analisa voz e comportamento para ajudar profissionais de saúde mental a 
              detectar precocemente riscos, otimizar atendimentos e reduzir burocracias.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="gradient" size="lg" className="text-lg" asChild>
                <a href={appHref("roleSelect")}>Testar agora</a>
              </Button>
              <Button variant="hero" size="lg" className="text-lg" asChild>
                <a href={appHref("roleSelect")}>Entrar</a>
              </Button>
            </div>
          </div>

          {/* Right Content - Mockup */}
          <div className="relative animate-slide-up">
            <div className="relative rounded-2xl overflow-hidden shadow-large">
              <img 
                src={heroMockup} 
                alt="Dashboard Synapsa.ai mostrando análises de saúde mental"
                className="w-full h-auto"
              />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/30 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/30 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
