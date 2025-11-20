import React, { createContext, useContext, useState, useEffect } from 'react';
import { DadosApp, UserRole } from "@/professionals/types";
import { toast } from "@/hooks/use-toast";

interface AppContextType extends DadosApp {
  setPerfil: (perfil: UserRole) => void;
  updatePacientes: (pacientes: DadosApp['pacientes']) => void;
  updateConsultas: (consultas: DadosApp['consultas']) => void;
  updateMensagensPadrao: (mensagens: DadosApp['mensagensPadrao']) => void;
  updateRecebimentos: (recebimentos: DadosApp['recebimentos']) => void;
  updateNotificacoes: (notificacoes: DadosApp['notificacoes']) => void;
  updateFormularios: (formularios: DadosApp['formularios']) => void;
  updateValorPadraoConsulta: (valor: number) => void;
  toggleTema: () => void;
  salvarDados: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'synapsa-crm-data';

const dadosPadrao: DadosApp = {
  perfil: 'agente',
  pacientes: [],
  consultas: [],
  mensagensPadrao: [
    {
      id: '1',
      nome: 'Lembrete de Consulta',
      tipo: 'lembrete',
      conteudo: 'Olá! Este é um lembrete da sua consulta agendada para amanhã às {{hora}}. Caso precise reagendar, por favor entre em contato.'
    },
    {
      id: '2',
      nome: 'Reagendamento',
      tipo: 'reagendamento',
      conteudo: 'Olá! Sua consulta foi reagendada para {{data}} às {{hora}}. Confirme seu comparecimento.'
    },
    {
      id: '3',
      nome: 'Cancelamento',
      tipo: 'cancelamento',
      conteudo: 'Informamos que sua consulta agendada para {{data}} foi cancelada. Entre em contato para reagendar.'
    },
    {
      id: '4',
      nome: 'Agradecimento',
      tipo: 'agradecimento',
      conteudo: 'Obrigado(a) por comparecer à consulta hoje! Qualquer dúvida, estou à disposição.'
    },
    {
      id: '5',
      nome: 'Follow-up Pós-consulta',
      tipo: 'followup',
      conteudo: 'Olá! Como você está se sentindo após nossa última consulta? Estou à disposição caso precise conversar.'
    }
  ],
  recebimentos: [],
  notificacoes: [],
  formularios: [],
  tema: 'light',
  valorPadraoConsulta: 200
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dados, setDados] = useState<DadosApp>(dadosPadrao);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);
    if (dadosSalvos) {
      try {
        const parsed = JSON.parse(dadosSalvos);
        setDados({ ...dadosPadrao, ...parsed });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
  }, []);

  // Aplicar tema
  useEffect(() => {
    if (dados.tema === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dados.tema]);

  const salvarDados = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
      toast({
        title: '✓ Alterações salvas',
        duration: 2000,
      });
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as alterações.',
        variant: 'destructive',
      });
    }
  };

  // Auto-save quando dados mudarem
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
    }, 1000);
    return () => clearTimeout(timer);
  }, [dados]);

  const contextValue: AppContextType = {
    ...dados,
    setPerfil: (perfil) => setDados(prev => ({ ...prev, perfil })),
    updatePacientes: (pacientes) => setDados(prev => ({ ...prev, pacientes })),
    updateConsultas: (consultas) => setDados(prev => ({ ...prev, consultas })),
    updateMensagensPadrao: (mensagensPadrao) => setDados(prev => ({ ...prev, mensagensPadrao })),
    updateRecebimentos: (recebimentos) => setDados(prev => ({ ...prev, recebimentos })),
    updateNotificacoes: (notificacoes) => setDados(prev => ({ ...prev, notificacoes })),
    updateFormularios: (formularios) => setDados(prev => ({ ...prev, formularios })),
    updateValorPadraoConsulta: (valor) => setDados(prev => ({ ...prev, valorPadraoConsulta: valor })),
    toggleTema: () => setDados(prev => ({ ...prev, tema: prev.tema === 'light' ? 'dark' : 'light' })),
    salvarDados,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
};
