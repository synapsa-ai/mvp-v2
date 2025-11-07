import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash";
import RoleSelect from "./pages/RoleSelect";
import Home from "./pages/Home";
import AIVoice from "./pages/AIVoice";
import Schedule from "./pages/Schedule";
import Finance from "./pages/Finance";
import MedicalRecord from "./pages/MedicalRecord";
import Chat from "./pages/Chat";
import DoctorProfile from "./pages/DoctorProfile";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/role-select" element={<RoleSelect />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/ai-voice" element={<AIVoice />} />
            {/* substitui os placeholders por páginas */}
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/medical-record" element={<MedicalRecord />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/doctor-profile" element={<DoctorProfile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
