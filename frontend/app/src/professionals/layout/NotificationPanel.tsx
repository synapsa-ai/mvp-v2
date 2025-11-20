import { X, AlertCircle, Info, CheckCircle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/professionals/context/AppContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, id?: string) => void;
}

export const NotificationPanel = ({ isOpen, onClose, onNavigate }: NotificationPanelProps) => {
  const { notificacoes, updateNotificacoes } = useApp();

  const handleNotificationClick = (notificacao: any) => {
    // Marcar como lida
    const updated = notificacoes.map(n => 
      n.id === notificacao.id ? { ...n, lida: true } : n
    );
    updateNotificacoes(updated);

    // Navegar para o link se existir
    if (notificacao.link) {
      onNavigate(
        notificacao.link.tipo === 'paciente' ? 'pacientes' : 'agenda',
        notificacao.link.id
      );
    }
    onClose();
  };

  const marcarTodasComoLidas = () => {
    const updated = notificacoes.map(n => ({ ...n, lida: true }));
    updateNotificacoes(updated);
  };

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'alerta':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'sucesso':
        return <CheckCircle className="h-5 w-5 text-secondary" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-card border-l shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Notificações</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {notificacoes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Bell className="h-12 w-12 mb-4 opacity-20" />
            <p>Nenhuma notificação</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={marcarTodasComoLidas}
                className="w-full"
              >
                Marcar todas como lidas
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-10rem)]">
              <div className="p-4 space-y-3">
                {notificacoes.map((notificacao) => (
                  <button
                    key={notificacao.id}
                    onClick={() => handleNotificationClick(notificacao)}
                    className={cn(
                      "w-full text-left p-4 rounded-lg border transition-colors",
                      notificacao.lida 
                        ? "bg-muted/30 hover:bg-muted/50" 
                        : "bg-background hover:bg-muted/50 border-primary/20"
                    )}
                  >
                    <div className="flex gap-3">
                      {getIcon(notificacao.tipo)}
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium mb-1",
                          !notificacao.lida && "text-primary"
                        )}>
                          {notificacao.titulo}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {notificacao.mensagem}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notificacao.data).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  );
};
