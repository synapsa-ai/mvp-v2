import { Button } from "@/components/ui/button";
import { appHref } from "@/lib/appRoute";

export const FinalCTA = () => {
  return (
    <section className="py-24 bg-gradient-dark text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 animate-fade-in">
          A próxima geração da saúde mental digital já começou.
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
          <Button variant="hero" size="lg" className="text-lg min-w-[200px]" asChild>
            <a href={appHref("roleSelect")}>Criar conta gratuita</a>
          </Button>
          <Button variant="secondary" size="lg" className="text-lg min-w-[200px]" asChild>
            <a href={appHref("roleSelect")}>Entrar na plataforma</a>
          </Button>
        </div>
      </div>
    </section>
  );
};
