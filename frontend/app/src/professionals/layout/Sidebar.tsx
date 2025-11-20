import { 
  Users, 
  Calendar, 
  MessageSquare, 
  FileText, 
  DollarSign, 
  Bot, 
  Settings,
  LayoutDashboard,
  ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pacientes', label: 'Pacientes', icon: Users },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'mensagens', label: 'Mensagens', icon: MessageSquare },
  { id: 'formularios', label: 'Formulários', icon: ClipboardList },
  { id: 'relatorios', label: 'Relatórios', icon: FileText },
  { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
  { id: 'assistenteIA', label: 'Assistente IA', icon: Bot },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
];

export const Sidebar = ({ currentView, onNavigate }: SidebarProps) => {
  return (
    <aside className="w-64 border-r bg-card h-[calc(100vh-4rem)] sticky top-16">
      <nav className="flex flex-col gap-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "justify-start gap-3 h-11",
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
