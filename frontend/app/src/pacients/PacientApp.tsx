// src/pacients/PacientApp.tsx
import { useState } from "react";
import PacientLayout, { type PacientViewId } from "./layout/PacientLayout";

// páginas internas
import Home from "./pages/Home";
import AIVoice from "./pages/AIVoice";
import Schedule from "./pages/Schedule";
import MedicalRecord from "./pages/MedicalRecord";
import Settings from "./pages/Settings";
import Finance from "./pages/financeiro"; // confere se o arquivo é mesmo 'financeiro.tsx'

const PacientApp = () => {
  const [currentView, setCurrentView] = useState<PacientViewId>("home");

  const renderView = () => {
    switch (currentView) {
      case "home":
        return <Home onNavigate={setCurrentView} />;
      case "aiVoice":
        return <AIVoice />;
      case "schedule":
        return <Schedule />;
      case "medicalRecord":
        return <MedicalRecord />;
      case "finance":
        return <Finance />;
      case "settings":
        return <Settings />;
      default:
        return <Home onNavigate={setCurrentView} />;
    }
  };

  return (
    <PacientLayout
      title="Área do Paciente"
      onNavigate={setCurrentView}
      activeView={currentView}
    >
      {renderView()}
    </PacientLayout>
  );
};

export default PacientApp;
