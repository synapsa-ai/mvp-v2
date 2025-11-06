import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { appHref } from "@/lib/appRoute";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Início", href: "#inicio" },
    { label: "Solução", href: "#solucao" },
    { label: "Sobre", href: "#sobre" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#inicio"
            className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent"
          >
            Synapsa.ai
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild>
              <a href={appHref("login")}>Login</a>
            </Button>
            <Button variant="outline" asChild>
              <a href={appHref("register")}>Cadastre-se</a>
            </Button>
            <Button variant="gradient" size="lg" asChild>
              <a href={appHref("roleSelect")}>Testar agora</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fade-in">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block py-2 text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}

            <div className="flex flex-col gap-2 pt-4">
              <Button variant="ghost" className="w-full" asChild>
                <a href={appHref("login")}>Login</a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href={appHref("register")}>Cadastre-se</a>
              </Button>
              <Button variant="gradient" size="lg" className="w-full" asChild>
                <a href={appHref("roleSelect")}>Testar agora</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
