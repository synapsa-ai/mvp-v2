// src/pacients/layout/Header.tsx
import { useState, FormEvent } from "react";
import { Search, Calendar, Mic, FileText, Settings, User, Banknote } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { PacientViewId } from "./PacientLayout";

interface PacientHeaderProps {
  title: string;
  activeView: PacientViewId;
  onNavigate: (view: PacientViewId) => void;
}

const PacientHeader = ({ title, activeView, onNavigate }: PacientHeaderProps) => {
  const [busca, setBusca] = useState("");

  const handleBusca = (e: FormEvent) => {
    e.preventDefault();
    if (busca.trim()) {
      // depois você pluga isso com o backend / busca global
      console.log("Buscar na área do paciente:", busca);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">

        {/* Logo + título */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-transparent flex items-center justify-center overflow-hidden">
            <img
              src="/images/favicon.svg"
              alt="Synapsa"
              className="h-8 w-8 object-contain"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-sm sm:text-base">Synapsa</span>
            <span className="text-xs text-muted-foreground">
              {title}
            </span>
          </div>
        </div>

        {/* Busca */}
        <form onSubmit={handleBusca} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar sessões, registros ou anotações..."
              className="pl-10"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </form>

        {/* Ações rápidas – específicas do paciente */}
        <div className="flex items-center gap-2">
          {/* Lyra */}
          <Button
            variant={activeView === "aiVoice" ? "default" : "ghost"}
            size="icon"
            onClick={() => onNavigate("aiVoice")}
            title="Lyra"
          >
            <Mic className="h-5 w-5" />
          </Button>

          {/* Agenda do paciente */}
          <Button
            variant={activeView === "schedule" ? "default" : "ghost"}
            size="icon"
            onClick={() => onNavigate("schedule")}
            title="Minha agenda"
          >
            <Calendar className="h-5 w-5" />
          </Button>

          {/* Minhas Notas */}
          <Button
            variant={activeView === "medicalRecord" ? "default" : "ghost"}
            size="icon"
            onClick={() => onNavigate("medicalRecord")}
            title="Minhas Notas"
          >
            <FileText className="h-5 w-5" />
          </Button>

          {/* Configurações */}
          <Button
            variant={activeView === "settings" ? "default" : "ghost"}
            size="icon"
            onClick={() => onNavigate("settings")}
            title="Configurações"
          >
            <Settings className="h-5 w-5" />
          </Button>

          {/* Financeiro */}
          <Button
            variant={activeView === "finance" ? "default" : "ghost"}
            size="icon"
            onClick={() => onNavigate("finance")}
            title="Financeiro"
          >
            <Banknote className="h-5 w-5" />
          </Button>

          {/* Menu do usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" title="Minha conta">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Paciente</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onNavigate("home")}>
                Voltar para início
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate("settings")}>
                Preferências
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log("Sair")}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default PacientHeader;
