// src/pacients/layout/Sidebar.tsx
import { LayoutDashboard, Banknote, Mic, Calendar, FileText, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PacientViewId } from "./PacientLayout";
interface SidebarProps {
  activeView: PacientViewId;
  onNavigate: (view: PacientViewId) => void;
}

const menuItems: { id: PacientViewId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "home",          label: "Dashboard",   icon: LayoutDashboard },
  { id: "aiVoice",       label: "Lyra",        icon: Mic },
  { id: "schedule",      label: "Minha Agenda",  icon: Calendar },
  { id: "medicalRecord", label: "Minhas Notas",    icon: FileText },
  { id: "finance",       label: "Financeiro",    icon: Banknote },
  { id: "settings",      label: "Configurações", icon: SettingsIcon },
];

const Sidebar = ({ activeView, onNavigate }: SidebarProps) => {
  return (
    <aside className="w-64 border-r bg-card h-[calc(100vh-4rem)] sticky top-16">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Área do paciente
        </h2>
      </div>

      <nav className="flex flex-col gap-1 p-4 pt-0">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "justify-start gap-3 h-11 text-sm",
                isActive && "bg-primary/10 text-primary hover:bg-primary/20"
              )}
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
