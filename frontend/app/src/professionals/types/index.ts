export type UserRole = 'agente' | 'secretaria' | 'gestor';

export type PacienteStatus = 'ativo' | 'alta' | 'risco';

export type ConsultaStatus = 'confirmado' | 'reagendado' | 'cancelado' | 'em_andamento' | 'concluido';

export type PagamentoStatus = 'pago' | 'pendente';

export interface Paciente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  status: PacienteStatus;
  proximaConsulta?: string;
  ultimaConsulta?: string;
  diagnosticoPrincipal?: string;
  etiquetas: string[];
  responsavel: string;
  observacoes?: string;
  prontuario: {
    notasClinicas: string;
    resumoIA?: string;
    historico: Array<{
      data: string;
      tipo: string;
      conteudo: string;
    }>;
    arquivos: Array<{
      nome: string;
      url: string;
      data: string;
    }>;
  };
  comunicacao: Array<{
    data: string;
    tipo: 'whatsapp' | 'email' | 'telefone';
    mensagem: string;
    enviado: boolean;
  }>;
  criadoEm: string;
}

export interface Consulta {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  data: string;
  hora: string;
  duracao: number; // em minutos
  local: 'presencial' | 'online';
  linkVideo?: string;
  status: ConsultaStatus;
  motivo?: string;
  observacoes?: string;
  diagnosticoProvisorio?: string;
  resumoIA?: string;
}

export interface MensagemPadrao {
  id: string;
  nome: string;
  tipo: 'lembrete' | 'reagendamento' | 'cancelamento' | 'agradecimento' | 'followup' | 'custom';
  conteudo: string;
}

export interface Recebimento {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  data: string;
  valor: number;
  formaPagamento: string;
  status: PagamentoStatus;
  observacoes?: string;
  consultaId?: string;
}

export interface Notificacao {
  id: string;
  tipo: 'alerta' | 'info' | 'sucesso';
  titulo: string;
  mensagem: string;
  link?: {
    tipo: 'paciente' | 'consulta';
    id: string;
  };
  lida: boolean;
  data: string;
}

export interface FormularioPergunta {
  id: string;
  pergunta: string;
  tipo: 'texto' | 'numero' | 'escala' | 'multipla';
  opcoes?: string[];
  obrigatoria: boolean;
}

export interface FormularioPreConsulta {
  id: string;
  nome: string;
  perguntas: FormularioPergunta[];
  ativo: boolean;
}

export interface DadosApp {
  perfil: UserRole;
  pacientes: Paciente[];
  consultas: Consulta[];
  mensagensPadrao: MensagemPadrao[];
  recebimentos: Recebimento[];
  notificacoes: Notificacao[];
  formularios: FormularioPreConsulta[];
  tema: 'light' | 'dark';
  valorPadraoConsulta: number;
}
