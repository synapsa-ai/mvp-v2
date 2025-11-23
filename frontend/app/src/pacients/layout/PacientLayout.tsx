// src/pacients/layout/PacientLayout.tsx
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import PacientHeader from "./Header";

export type PacientViewId =
  | "home"
  | "aiVoice"
  | "schedule"
  | "medicalRecord"
  | "settings";

interface PacientLayoutProps {
  title: string;
  activeView: PacientViewId;
  onNavigate: (view: PacientViewId) => void;
  children: ReactNode;
}

const PacientLayout = ({
  title,
  activeView,
  onNavigate,
  children,
}: PacientLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER NO TOPO DA PÁGINA TODA */}
      <PacientHeader
        title={title}
        activeView={activeView}
        onNavigate={onNavigate}
      />

      {/* CONTEÚDO: SIDEBAR + MAIN, IGUAL PROFESSIONAL */}
      <div className="flex flex-1">
        <Sidebar activeView={activeView} onNavigate={onNavigate} />

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PacientLayout;
