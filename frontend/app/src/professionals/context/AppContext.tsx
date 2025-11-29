import React, { createContext, useContext, useState, useEffect } from 'react';
import { DadosApp } from "@/professionals/types";
import { toast } from "@/hooks/use-toast";

interface AppContextType extends DadosApp {
  updatePacientes: (p: DadosApp['pacientes']) => void;
  updateConsultas: (c: DadosApp['consultas']) => void;
  updateMensagensPadrao: (m: DadosApp['mensagensPadrao']) => void;
  updateRecebimentos: (r: DadosApp['recebimentos']) => void;
  updateNotificacoes: (n: DadosApp['notificacoes']) => void;
  updateFormularios: (f: DadosApp['formularios']) => void;

  // financeiras
  updateValorPadraoConsulta: (v: number) => void;

  // tema
  toggleTema: () => void;

  // dados profissionais
  updateNomeProfissional: (nome: string) => void;
  updateCRP: (crp: string) => void;
  updateAbordagem: (abordagem: string) => void;
  updateRegistroExtra: (r: string) => void;
  updateFotoProfissional: (fotoBase64: string) => void;

  salvarDados: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// STORAGE
const STORAGE_KEY = "synapsa-crm-data";

// DADOS PADRÃO
const dadosPadrao: DadosApp = {
  pacientes: [],
  consultas: [],
  mensagensPadrao: [
    {
      id: '1',
      nome: 'Lembrete de Consulta',
      tipo: 'lembrete',
      conteudo: 'Olá! Lembramos da sua consulta amanhã às {{hora}}.'
    },
    {
      id: '2',
      nome: 'Reagendamento',
      tipo: 'reagendamento',
      conteudo: 'Sua consulta foi reagendada para {{data}} às {{hora}}.'
    },
    {
      id: '3',
      nome: 'Cancelamento',
      tipo: 'cancelamento',
      conteudo: 'Sua consulta de {{data}} às {{hora}} foi cancelada.'
    },
    {
      id: '4',
      nome: 'Agradecimento',
      tipo: 'agradecimento',
      conteudo: 'Obrigado(a) pelo comparecimento!'
    },
    {
      id: '5',
      nome: 'Follow-up Pós-consulta',
      tipo: 'followup',
      conteudo: 'Como você está após nossa última sessão?'
    }
  ],
  recebimentos: [],
  notificacoes: [],
  formularios: [],

  // visuais
  tema: "light",

  // financeiro
  valorPadraoConsulta: 200,

  // dados profissionais novos
  nomeProfissional: "",
  crp: "",
  abordagem: "",
  registroExtra: "",
  fotoProfissional: "" // base64
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [dados, setDados] = useState<DadosApp>(dadosPadrao);

  // carregar localStorage
  useEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) {
      try {
        const parsed = JSON.parse(salvo);
        setDados({ ...dadosPadrao, ...parsed });
      } catch (e) {
        console.error("Erro ao carregar storage", e);
      }
    }
  }, []);

  // aplicar tema
  useEffect(() => {
    if (dados.tema === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dados.tema]);

  // auto-save
  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
    }, 600);
    return () => clearTimeout(t);
  }, [dados]);

  // função manual
  const salvarDados = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
      toast({ title: "✓ Alterações salvas", duration: 1200 });
    } catch {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar.",
        variant: "destructive"
      });
    }
  };

  const ctx: AppContextType = {
    ...dados,

    updatePacientes: (pacientes) => setDados(prev => ({ ...prev, pacientes })),
    updateConsultas: (consultas) => setDados(prev => ({ ...prev, consultas })),
    updateMensagensPadrao: (mensagensPadrao) => setDados(prev => ({ ...prev, mensagensPadrao })),
    updateRecebimentos: (recebimentos) => setDados(prev => ({ ...prev, recebimentos })),
    updateNotificacoes: (notificacoes) => setDados(prev => ({ ...prev, notificacoes })),
    updateFormularios: (formularios) => setDados(prev => ({ ...prev, formularios })),

    updateValorPadraoConsulta: (v) =>
      setDados(prev => ({ ...prev, valorPadraoConsulta: v })),

    toggleTema: () =>
      setDados(prev => ({ ...prev, tema: prev.tema === "light" ? "dark" : "light" })),

    updateNomeProfissional: (nome) =>
      setDados(prev => ({ ...prev, nomeProfissional: nome })),

    updateCRP: (crp) =>
      setDados(prev => ({ ...prev, crp })),

    updateAbordagem: (abordagem) =>
      setDados(prev => ({ ...prev, abordagem })),

    updateRegistroExtra: (registroExtra) =>
      setDados(prev => ({ ...prev, registroExtra })),

    updateFotoProfissional: (fotoBase64) =>
      setDados(prev => ({ ...prev, fotoProfissional: fotoBase64 })),

    salvarDados,
  };

  return (
    <AppContext.Provider value={ctx}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp deve ser usado dentro de AppProvider");
  return ctx;
};
