// app/src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// raiz
import Splash from "./pages/Splash";
import RoleSelect from "./pages/RoleSelect";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

// pacientes
import PacientApp from "./pacients/PacientApp";
import AIVoice from "./pacients/pages/AIVoice";
import Schedule from "./pacients/pages/Schedule";
import MedicalRecord from "./pacients/pages/MedicalRecord";

import Settings from "./pacients/pages/Settings";

// profissionais
import ProfessionalApp from "./professionals/ProfessionalApp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* públicas / base */}
          <Route path="/" element={<Splash />} />
          <Route path="/role-select" element={<RoleSelect />} />

          {/* fluxo paciente com Layout padrão */}
          <Route element={<Layout />}>
          {/* Área do paciente controlada pelo PacientApp */}
          <Route path="/pacients" element={<PacientApp />} />
        </Route>

          {/* fluxo profissional: CRM Lovable */}
          <Route path="/professional/*" element={<ProfessionalApp />} />

          {/* fallback */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
