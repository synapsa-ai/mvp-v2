import { Search, Bell, Calendar, MessageSquare, FileText, Moon, Sun, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useApp } from '@/professionals/context/AppContext';


import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  onNavigate: (view: string) => void;
  onToggleNotifications: () => void;
}

export const Header = ({ onNavigate, onToggleNotifications }: HeaderProps) => {
  const { tema, toggleTema, perfil, setPerfil, notificacoes } = useApp();
  const [buscaGlobal, setBuscaGlobal] = useState('');

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault();
    if (buscaGlobal.trim()) {
      // Busca será implementada em cada página
      console.log('Buscar:', buscaGlobal);
    }
  };

  const perfilLabel = perfil === 'agente' ? 'Agente' : perfil === 'secretaria' ? 'Secretária' : 'Gestor';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-lg hidden sm:inline">Synapsa CRM</span>
        </div>

        {/* Busca Global */}
        <form onSubmit={handleBusca} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar paciente, consulta ou mensagem..."
              className="pl-10"
              value={buscaGlobal}
              onChange={(e) => setBuscaGlobal(e.target.value)}
            />
          </div>
        </form>

        {/* Ações Rápidas */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('agenda')}
            title="Agenda"
          >
            <Calendar className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('mensagens')}
            title="Mensagens"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('relatorios')}
            title="Relatórios"
          >
            <FileText className="h-5 w-5" />
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleNotifications}
              title="Notificações"
            >
              <Bell className="h-5 w-5" />
            </Button>
            {notificacoesNaoLidas > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {notificacoesNaoLidas}
              </Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTema}
            title={tema === 'light' ? 'Modo Escuro' : 'Modo Claro'}
          >
            {tema === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {/* Menu do Usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Perfil Atual: {perfilLabel}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setPerfil('agente')}>
                {perfil === 'agente' && '✓ '}Agente
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPerfil('secretaria')}>
                {perfil === 'secretaria' && '✓ '}Secretária
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPerfil('gestor')}>
                {perfil === 'gestor' && '✓ '}Gestor
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onNavigate('perfil')}>
                Configurações
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
