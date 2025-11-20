import { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { SelectProfile } from './SelectProfile';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { NotificationPanel } from '@/components/layout/NotificationPanel';
import { Dashboard } from './Dashboard';
import { Pacientes } from './Pacientes';
import { Agenda } from './Agenda';
import { Mensagens } from './Mensagens';
import { Relatorios } from './Relatorios';
import { Financeiro } from './Financeiro';
import { AssistenteIA } from './AssistenteIA';
import { Configuracoes } from './Configuracoes';
import { Formularios } from './Formularios';

const AppContent = () => {
  const { perfil } = useApp();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasSelectedProfile, setHasSelectedProfile] = useState(false);

  // Se ainda não selecionou o perfil
  if (!hasSelectedProfile) {
    return <SelectProfile onComplete={() => setHasSelectedProfile(true)} />;
  }

  const handleNavigate = (view: string, id?: string) => {
    setCurrentView(view);
    setShowNotifications(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'pacientes':
        return <Pacientes />;
      case 'agenda':
        return <Agenda />;
      case 'mensagens':
        return <Mensagens />;
      case 'relatorios':
        return <Relatorios />;
      case 'financeiro':
        return <Financeiro />;
      case 'assistenteIA':
        return <AssistenteIA />;
      case 'formularios':
        return <Formularios />;
      case 'configuracoes':
      case 'perfil':
        return <Configuracoes />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onNavigate={handleNavigate}
        onToggleNotifications={() => setShowNotifications(!showNotifications)}
      />
      
      <div className="flex">
        <Sidebar currentView={currentView} onNavigate={handleNavigate} />
        
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

const Index = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
