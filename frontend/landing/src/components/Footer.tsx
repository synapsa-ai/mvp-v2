import { Linkedin, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer id="contato" className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Contato
            </a>
          </div>

          {/* Social Media */}
          <div className="flex gap-4">
            <a 
              href="#" 
              className="w-10 h-10 rounded-full bg-accent hover:bg-primary transition-colors flex items-center justify-center group"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-foreground group-hover:text-white" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 rounded-full bg-accent hover:bg-secondary transition-colors flex items-center justify-center group"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-foreground group-hover:text-white" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          © 2025 Synapsa.ai — Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};
