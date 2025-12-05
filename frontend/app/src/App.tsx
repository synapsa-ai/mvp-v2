// app/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

// primeira tela
import RoleSelect from "./pages/RoleSelect";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";           // 👈 importa
import ForgotPassword from "./pages/ForgotPassword"; // 👈 importa

// carregamento tardio dos "sub-apps"
const PacientApp = lazy(() => import("./pacients/PacientApp"));
const ProfessionalApp = lazy(() => import("./professionals/ProfessionalApp"));

const App = () => (
  <BrowserRouter>
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center">
          <span>Carregando...</span>
        </div>
      }
    >
      <Routes>
        {/* PRIMEIRA TELA: seleção de papel */}
        <Route path="/" element={<RoleSelect />} />
        <Route path="/role-select" element={<RoleSelect />} />

        {/* Autenticação */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />              {/* 👈 aqui */}
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* 👈 e aqui */}

        {/* Área do paciente */}
        <Route path="/pacients/*" element={<PacientApp />} />

        {/* Área do profissional */}
        <Route path="/professional/*" element={<ProfessionalApp />} />

        {/* fallback / 404 */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
