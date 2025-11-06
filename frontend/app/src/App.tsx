import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import RoleSelect from "./pages/RoleSelect";
import Home from "./pages/Home";
import AIVoice from "./pages/AIVoice";
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
            <Route path="/schedule" element={<div className="p-8"><h1 className="text-3xl font-heading font-bold">Schedule</h1><p className="text-muted-foreground mt-2">Coming soon</p></div>} />
            <Route path="/finance" element={<div className="p-8"><h1 className="text-3xl font-heading font-bold">Finance</h1><p className="text-muted-foreground mt-2">Coming soon</p></div>} />
            <Route path="/medical-record" element={<div className="p-8"><h1 className="text-3xl font-heading font-bold">Medical Record</h1><p className="text-muted-foreground mt-2">Coming soon</p></div>} />
            <Route path="/chat" element={<div className="p-8"><h1 className="text-3xl font-heading font-bold">Chat</h1><p className="text-muted-foreground mt-2">Coming soon</p></div>} />
            <Route path="/doctor-profile" element={<div className="p-8"><h1 className="text-3xl font-heading font-bold">Doctor Profile</h1><p className="text-muted-foreground mt-2">Coming soon</p></div>} />
            <Route path="/settings" element={<div className="p-8"><h1 className="text-3xl font-heading font-bold">Settings</h1><p className="text-muted-foreground mt-2">Coming soon</p></div>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
