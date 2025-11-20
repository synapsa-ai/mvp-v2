// app/src/professionals/ProfessionalApp.tsx
import { useState } from "react";

import { Header } from "./layout/Header";
import { Sidebar } from "./layout/Sidebar";
import { NotificationPanel } from "./layout/NotificationPanel";
import { AppProvider } from "./context/AppContext";


// páginas – agora como *named exports*
import { Dashboard } from "./pages/Dashboard";
import { Pacientes } from "./pages/Pacientes";
import { Agenda } from "./pages/Agenda";
import { Mensagens } from "./pages/Mensagens";
import { Formularios } from "./pages/Formularios";
import { Relatorios } from "./pages/Relatorios";
import { Financeiro } from "./pages/Financeiro";
import { AssistenteIA } from "./pages/AssistenteIA";
import { Configuracoes } from "./pages/Configuracoes";

type ViewId =
  | "dashboard"
  | "pacientes"
  | "agenda"
  | "mensagens"
  | "formularios"
  | "relatorios"
  | "financeiro"
  | "assistenteIA"
  | "configuracoes";

const ProfessionalApp = () => {
  const [currentView, setCurrentView] = useState<ViewId>("dashboard");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleNavigate = (view: string) => {
    setCurrentView(view as ViewId);
  };

  const handleNavigateFromNotification = (view: string, _id?: string) => {
    setCurrentView(view as ViewId);
    setNotificationsOpen(false);
  };

const renderView = () => {
  switch (currentView) {
    case "dashboard":
      return <Dashboard onNavigate={handleNavigate} />; // 👈 aqui
    case "pacientes":
      return <Pacientes />;
    case "agenda":
      return <Agenda />;
    case "mensagens":
      return <Mensagens />;
    case "formularios":
      return <Formularios />;
    case "relatorios":
      return <Relatorios />;
    case "financeiro":
      return <Financeiro />;
    case "assistenteIA":
      return <AssistenteIA />;
    case "configuracoes":
      return <Configuracoes />;
    default:
      return <Dashboard onNavigate={handleNavigate} />; // 👈 aqui também
  }
};

  return (
    <AppProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          onNavigate={handleNavigate}
          onToggleNotifications={() => setNotificationsOpen(true)}
        />

        <div className="flex flex-1">
          <Sidebar currentView={currentView} onNavigate={handleNavigate} />
          <main className="flex-1 p-6 overflow-auto">{renderView()}</main>
        </div>

        <NotificationPanel
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          onNavigate={handleNavigateFromNotification}
        />
      </div>
    </AppProvider>
  );
};

export default ProfessionalApp;
