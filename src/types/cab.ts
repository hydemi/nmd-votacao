export type CABArea = 'GEMOL' | 'GETIS' | 'GMIB' | 'GEDAN' | 'GEROP' | 'GEMUD' | 'SUDEC';

export interface AreaInfo {
  code: CABArea;
  nome: string;
  descricao: string;
  cor: string;
}

export const CAB_AREAS_INFO: Record<CABArea, AreaInfo> = {
  GEMUD: {
    code: 'GEMUD',
    nome: 'Gerência de Gestão de Mudanças',
    descricao: 'Governança, conformidade com políticas de TI e orquestração do CAB',
    cor: 'border-indigo-200 text-indigo-700 bg-indigo-50',
  },
  GETIS: {
    code: 'GETIS',
    nome: 'Gerência de TI e Segurança da Informação',
    descricao: 'Políticas de segurança, vulnerabilidades, controles de acesso e compliance',
    cor: 'border-rose-200 text-rose-700 bg-rose-50',
  },
  GEMOL: {
    code: 'GEMOL',
    nome: 'Gerência de Operações e Logística',
    descricao: 'Continuidade de negócios, logística operacional e monitoramento',
    cor: 'border-amber-200 text-amber-700 bg-amber-50',
  },
  GMIB: {
    code: 'GMIB',
    nome: 'Gerência de Mudanças e Infraestrutura Básica',
    descricao: 'Data centers, servidores físicos/virtuais, storage e virtualização',
    cor: 'border-cyan-200 text-cyan-700 bg-cyan-50',
  },
  GEDAN: {
    code: 'GEDAN',
    nome: 'Gerência de Dados e Analytics',
    descricao: 'Bancos de dados relacionais/NoSQL, scripts DML/DDL e pipelines ETL',
    cor: 'border-emerald-200 text-emerald-700 bg-emerald-50',
  },
  GEROP: {
    code: 'GEROP',
    nome: 'Gerência de Redes e Operações de Telecom',
    descricao: 'Switches, roteamento, balanceadores de carga, firewall e conectividade',
    cor: 'border-purple-200 text-purple-700 bg-purple-50',
  },
  SUDEC: {
    code: 'SUDEC',
    nome: 'Superintendência de Desenvolvimento e Clientes',
    descricao: 'Sistemas de negócio, esteiras de microsserviços e experiência do usuário final',
    cor: 'border-blue-200 text-blue-700 bg-blue-50',
  },
};

export type VoteType = 'favoravel' | 'ressalva' | 'contrario' | 'pendente' | 'abstencao';

export interface AreaVote {
  vote: VoteType;
  ressalva?: string;
  autor?: string;
  dataHora?: string;
}

export type TaskCategory = 
  | 'DML'
  | 'Deploy'
  | 'Configuração de Infra'
  | 'Firewall e Redes'
  | 'Testes de Fumaça';

export interface ChangeTask {
  id: string;
  categoria: TaskCategory;
  descricao: string;
  inicio: string;
  termino: string;
  grupoDesignado: string;
  responsavel: string;
  riscoEstimado: 'Baixo' | 'Médio' | 'Alto';
  ordem: number;
}

export interface RollbackActivity {
  id: string;
  passo: number;
  descricao: string;
  tempoEstimado: string;
  responsavel: string;
  gatilho: string;
}

export interface RollbackPlan {
  tempoTotalEstimado: string;
  horarioLimiteDecisao: string;
  criterioAcionamento: string;
  passos: RollbackActivity[];
}

export type Criticidade = 'Crítica' | 'Alta' | 'Média' | 'Padrão';

export type RelevanciaRisco = 'Baixa' | 'Média' | 'Alta' | 'Estratégica';
export type ClassificacaoRisco = 'Risco Baixo' | 'Risco Moderado' | 'Risco Elevado' | 'Risco Extremo';

export interface RiskAssessment {
  relevancia: RelevanciaRisco;
  severidade: number; // 1 a 5
  probabilidade: number; // 1 a 5
  nivelRisco: number; // severidade * probabilidade (1 a 25)
  classificacaoRisco: ClassificacaoRisco;
  justificativaRisco: string;
}

export interface ImplementationSchedule {
  dataPrevista: string;
  areaNegocial: string;
  areaTecnica: string;
  areasExecutoras: string[];
}

export interface ChangeRequest {
  id: string;
  titulo: string;
  servicoAfetado: string;
  criticidade: Criticidade;
  descricao: string;
  justificativaNegocio: string;
  impactoEsperado: string;
  janelaInicio: string;
  janelaTermino: string;
  janelaFormatada: string;
  diaFimDeSemana: 'Sábado' | 'Domingo';
  atividades: ChangeTask[];
  rollback: RollbackPlan;
  votos: Record<CABArea, AreaVote>;
  conflitoDetectado?: string;
  analiseRisco: RiskAssessment;
  agendaExecutiva: ImplementationSchedule;
}

export interface MeetingRepresentative {
  area: CABArea;
  nome: string;
  cargo: string;
  presencaConfirmada: boolean;
  horarioRegistro: string;
}

export interface CABMeetingMinutes {
  numeroAta: string;
  ano: number;
  dataRealizacao: string;
  horarioInicio: string;
  horarioTermino: string;
  local: string;
  coordenadorGeral: string;
  secretarioExecutivo: string;
  pauta: string;
  representantes: MeetingRepresentative[];
  parecerGeral: string;
}
