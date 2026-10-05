import React, { useState } from 'react';
import { CABMeetingMinutes, ChangeRequest, TaskCategory } from '../types/cab';
import { getVoteBadge } from './VotesSummary';
import { 
  Printer, 
  FileText, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Rocket,
  Server,
  ShieldCheck,
  ChevronRight,
  Layers,
  RotateCcw
} from 'lucide-react';

interface CABMeetingMinutesViewProps {
  minutes: CABMeetingMinutes;
  changes: ChangeRequest[];
  onPrint: () => void;
}

const CATEGORY_ICONS: Record<TaskCategory, React.ReactNode> = {
  'DML': <Database className="w-3.5 h-3.5 text-emerald-600 inline mr-1" />,
  'Deploy': <Rocket className="w-3.5 h-3.5 text-sky-600 inline mr-1" />,
  'Configuração de Infra': <Server className="w-3.5 h-3.5 text-cyan-600 inline mr-1" />,
  'Firewall e Redes': <ShieldCheck className="w-3.5 h-3.5 text-rose-600 inline mr-1" />,
  'Testes de Fumaça': <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 inline mr-1" />,
};

export const CABMeetingMinutesView: React.FC<CABMeetingMinutesViewProps> = ({
  minutes,
  changes,
  onPrint,
}) => {
  const [activeSection, setActiveSection] = useState<string>('dados-reuniao');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Compute status summary for the agenda
  const totalApproved = changes.filter(c => {
    const hasContrario = Object.values(c.votos).some(v => v.vote === 'contrario');
    return !hasContrario;
  }).length;

  const totalWithRessalva = changes.filter(c => {
    const hasContrario = Object.values(c.votos).some(v => v.vote === 'contrario');
    const hasRessalva = Object.values(c.votos).some(v => v.vote === 'ressalva');
    return !hasContrario && hasRessalva;
  }).length;

  const totalBlocked = changes.filter(c => {
    return Object.values(c.votos).some(v => v.vote === 'contrario');
  }).length;

  return (
    <div className="bg-[#F2F6FA] min-h-[calc(100vh-65px)] py-6 px-3 sm:px-6 font-sans text-slate-900 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Sticky Navigation Anchor Index (Hidden in print) */}
        <nav className="w-full lg:w-64 shrink-0 bg-white border border-[#CCE2F2] rounded-xl p-4 shadow-xs sticky top-20 hidden lg:block print:hidden">
          <div className="flex items-center justify-between pb-3 border-b border-[#CCE2F2] mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#003882]">
              <FileText className="w-4 h-4 text-[#00A3E0]" />
              <span>Sumário da Ata</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EBF4FA] text-[#003882] font-semibold border border-[#CCE2F2]">
              Nº {minutes.numeroAta}
            </span>
          </div>

          <ul className="space-y-1 text-xs">
            <li>
              <button
                onClick={() => scrollToSection('dados-reuniao')}
                className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
                  activeSection === 'dados-reuniao'
                    ? 'bg-[#003882] text-white font-bold'
                    : 'text-slate-700 hover:bg-[#F0F6FB] hover:text-[#003882]'
                }`}
              >
                <span>1. Dados da Sessão</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('areas-votantes')}
                className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
                  activeSection === 'areas-votantes'
                    ? 'bg-[#003882] text-white font-bold'
                    : 'text-slate-700 hover:bg-[#F0F6FB] hover:text-[#003882]'
                }`}
              >
                <span>2. Áreas e Representantes</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('demandas-apreciadas')}
                className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
                  activeSection === 'demandas-apreciadas'
                    ? 'bg-[#003882] text-white font-bold'
                    : 'text-slate-700 hover:bg-[#F0F6FB] hover:text-[#003882]'
                }`}
              >
                <span>3. Implantações Apreciadas</span>
                <span className="font-mono text-[11px] font-semibold">({changes.length})</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('mapa-riscos')}
                className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
                  activeSection === 'mapa-riscos'
                    ? 'bg-[#003882] text-white font-bold'
                    : 'text-slate-700 hover:bg-[#F0F6FB] hover:text-[#003882]'
                }`}
              >
                <span>4. Mapa de Riscos</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('agenda-implantacao')}
                className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
                  activeSection === 'agenda-implantacao'
                    ? 'bg-[#003882] text-white font-bold'
                    : 'text-slate-700 hover:bg-[#F0F6FB] hover:text-[#003882]'
                }`}
              >
                <span>5. Agenda de Implantação</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            </li>
          </ul>

          <div className="mt-5 pt-4 border-t border-[#CCE2F2] space-y-2">
            <button
              onClick={onPrint}
              className="w-full py-2 bg-[#003882] hover:bg-[#002B66] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <div className="text-[11px] text-slate-500 text-center font-mono">
              Homologada em {minutes.dataRealizacao.split(' ')[0]}
            </div>
          </div>
        </nav>

        {/* Main Document Body (Formal Report) */}
        <div className="flex-1 w-full bg-white border border-[#CCE2F2] rounded-xl shadow-xs overflow-hidden print:border-none print:shadow-none">
          {/* Document Top Action Bar (Hidden in print) */}
          <div className="p-4 bg-[#F8FAFD] border-b border-[#CCE2F2] flex items-center justify-between flex-wrap gap-3 print:hidden">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-[#003882]">Ata Homologada</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-600">Documento Oficial de Registro de Governança de TI</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onPrint}
                className="px-3.5 py-1.5 bg-[#003882] hover:bg-[#002A66] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / Salvar em PDF</span>
              </button>
            </div>
          </div>

          {/* Institutional Document Header */}
          <div className="p-6 sm:p-8 border-b-2 border-[#003882] bg-gradient-to-b from-[#F0F6FB] to-white">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#003882] text-white flex items-center justify-center font-black font-mono text-xl tracking-tighter shadow-sm border border-[#00A3E0]/40">
                  BRB
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-[#003882] uppercase">
                    BRB - Banco de Brasília S.A.
                  </h1>
                  <div className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                    Diretoria de Tecnologia e Operações · DITEC
                  </div>
                  <div className="text-xs text-slate-500">
                    Comissão Consultiva de Gestão de Mudanças de TI (CAB)
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block px-3 py-1 bg-[#003882] text-white text-xs font-mono font-bold rounded shadow-2xs">
                  ATA DE REUNIÃO CAB Nº {minutes.numeroAta}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  Exercício {minutes.ano} · Classificação: Reservado Interno
                </div>
              </div>
            </div>

            <div className="mt-5 p-3.5 bg-white border border-[#CCE2F2] rounded-lg shadow-2xs text-xs text-slate-700 leading-relaxed">
              <strong className="text-[#003882] font-bold">Resumo Deliberativo: </strong>
              {minutes.parecerGeral}
            </div>

            {/* Deliberation Counters */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#EBF4FA] border border-[#CCE2F2] flex flex-col">
                <span className="text-[10px] text-slate-500 font-sans uppercase font-bold">Total Avaliadas:</span>
                <span className="text-lg font-bold text-[#003882]">{changes.length}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-col">
                <span className="text-[10px] text-emerald-800 font-sans uppercase font-bold">Aprovadas:</span>
                <span className="text-lg font-bold text-emerald-700">{totalApproved}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex flex-col">
                <span className="text-[10px] text-amber-800 font-sans uppercase font-bold">Com Ressalvas:</span>
                <span className="text-lg font-bold text-amber-700">{totalWithRessalva}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex flex-col">
                <span className="text-[10px] text-rose-800 font-sans uppercase font-bold">Bloqueadas / Veto:</span>
                <span className="text-lg font-bold text-rose-700">{totalBlocked}</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-10">
            {/* SEÇÃO 1: DADOS DA REUNIÃO */}
            <section id="dados-reuniao" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#003882]">
                <span className="w-6 h-6 rounded bg-[#003882] text-white flex items-center justify-center font-bold text-xs font-mono">1</span>
                <h2 className="text-sm sm:text-base font-bold text-[#003882] uppercase tracking-wide">
                  Dados Gerais da Reunião
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#F8FAFD] border border-[#CCE2F2] rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#00A3E0]" />
                    <span className="font-bold text-slate-700">Data de Realização: </span>
                    <span className="font-semibold text-slate-900">{minutes.dataRealizacao}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#00A3E0]" />
                    <span className="font-bold text-slate-700">Horário: </span>
                    <span className="font-mono text-slate-900">{minutes.horarioInicio} às {minutes.horarioTermino}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#00A3E0] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-700">Local e Modalidade: </span>
                      <span className="text-slate-800">{minutes.local}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#F8FAFD] border border-[#CCE2F2] rounded-lg space-y-2">
                  <div>
                    <span className="font-bold text-slate-700 block">Coordenação da Sessão: </span>
                    <span className="text-slate-900 font-semibold">{minutes.coordenadorGeral}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block">Secretariado Técnico: </span>
                    <span className="text-slate-900 font-semibold">{minutes.secretarioExecutivo}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block">Pauta Apreciada: </span>
                    <span className="text-slate-700">{minutes.pauta}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SEÇÃO 2: ÁREAS VOTANTES E REPRESENTANTES */}
            <section id="areas-votantes" className="scroll-mt-24 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#003882]">
                <span className="w-6 h-6 rounded bg-[#003882] text-white flex items-center justify-center font-bold text-xs font-mono">2</span>
                <h2 className="text-sm sm:text-base font-bold text-[#003882] uppercase tracking-wide">
                  Áreas Votantes Integrantes do Colegiado e Representantes
                </h2>
              </div>
              <p className="text-xs text-slate-600">
                Registro formal de presença e atesto dos conselheiros que exerceram o direito de deliberação e voto na presente sessão:
              </p>

              <div className="overflow-x-auto border border-[#CCE2F2] rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#EBF4FA] text-[#003882] border-b border-[#CCE2F2]">
                      <th className="py-2.5 px-3 font-bold text-center w-20">Sigla</th>
                      <th className="py-2.5 px-3 font-bold">Área Colegiada Representada</th>
                      <th className="py-2.5 px-3 font-bold">Representante Oficial (Votante)</th>
                      <th className="py-2.5 px-3 font-bold">Cargo / Função</th>
                      <th className="py-2.5 px-3 font-bold text-center w-28">Presença</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2EEF8]">
                    {minutes.representantes.map((rep) => (
                      <tr key={rep.area} className="hover:bg-[#F8FAFD] transition-colors">
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-[#003882]">
                          {rep.area}
                        </td>
                        <td className="py-2.5 px-3 text-slate-800 font-medium">
                          {rep.cargo.split('(')[0].trim()}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {rep.nome}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {rep.cargo}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono">
                            ✓ Presente ({rep.horarioRegistro})
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* SEÇÃO 3: RELAÇÃO DE IMPLANTAÇÕES APRECIADAS */}
            <section id="demandas-apreciadas" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#003882]">
                <span className="w-6 h-6 rounded bg-[#003882] text-white flex items-center justify-center font-bold text-xs font-mono">3</span>
                <h2 className="text-sm sm:text-base font-bold text-[#003882] uppercase tracking-wide">
                  Relação de Implantações Apreciadas pelo Colegiado (Tarefas, Votos e Ressalvas)
                </h2>
              </div>
              <p className="text-xs text-slate-600">
                Detalhamento técnico das solicitações avaliadas, suas respectivas tarefas programadas de implantação, plano de contingência/rollback, votação da comissão e salvaguardas vinculantes:
              </p>

              <div className="space-y-8">
                {changes.map((change, index) => {
                  const hasContrario = Object.values(change.votos).some(v => v.vote === 'contrario');
                  const hasRessalva = Object.values(change.votos).some(v => v.vote === 'ressalva');
                  const ressalvasEntries = Object.entries(change.votos).filter(([_, v]) => v.vote === 'ressalva' || (v.vote === 'contrario' && v.ressalva));

                  const statusTitle = hasContrario
                    ? 'BLOQUEADA / VETO REGISTRADO'
                    : hasRessalva
                    ? 'APROVADA COM RESSALVAS TÉCNICAS'
                    : 'APROVADA POR UNANIMIDADE';

                  const statusBadgeClass = hasContrario
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : hasRessalva
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300';

                  return (
                    <div 
                      key={change.id} 
                      className="border border-[#CCE2F2] rounded-xl overflow-hidden shadow-xs bg-white break-inside-avoid"
                    >
                      {/* Item Header */}
                      <div className="p-4 bg-[#F0F6FB] border-b border-[#CCE2F2] flex items-start justify-between flex-wrap gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-mono font-black text-[#003882] text-sm">
                              Item 3.{index + 1} · {change.id}
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="font-bold text-[#0055A5]">{change.servicoAfetado}</span>
                            <span className="text-slate-400">·</span>
                            <span className="font-mono text-emerald-700 font-bold">{change.janelaFormatada}</span>
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                            {change.titulo}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded text-xs font-bold border uppercase font-mono ${statusBadgeClass}`}>
                            {statusTitle}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5 space-y-5">
                        {/* Scope and Context */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-[#F8FAFD] p-3 rounded-lg border border-[#CCE2F2]">
                          <div>
                            <span className="font-bold text-[#003882] block mb-1">Descrição Técnica:</span>
                            <p className="text-slate-700 leading-relaxed">{change.descricao}</p>
                          </div>
                          <div>
                            <span className="font-bold text-[#003882] block mb-1">Impacto Previsto & Justificativa:</span>
                            <p className="text-slate-700 leading-relaxed mb-1">{change.justificativaNegocio}</p>
                            <span className="text-amber-800 font-semibold text-[11px]">Impacto: {change.impactoEsperado}</span>
                          </div>
                        </div>

                        {/* Planned Tasks Table */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-[#003882] uppercase tracking-wider flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-[#00A3E0]" />
                              <span>Tarefas Programadas na Implantação ({change.atividades.length} atividades)</span>
                            </span>
                          </div>
                          <div className="overflow-x-auto border border-[#CCE2F2] rounded-lg">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="bg-[#EBF4FA] text-[#003882] border-b border-[#CCE2F2]">
                                  <th className="py-2 px-2.5 font-bold text-center w-10">#</th>
                                  <th className="py-2 px-2.5 font-bold">Categoria</th>
                                  <th className="py-2 px-2.5 font-bold min-w-[200px]">Descrição da Atividade</th>
                                  <th className="py-2 px-2.5 font-bold whitespace-nowrap">Janela / Horário</th>
                                  <th className="py-2 px-2.5 font-bold whitespace-nowrap">Grupo Designado</th>
                                  <th className="py-2 px-2.5 font-bold whitespace-nowrap">Responsável Técnico</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#E2EEF8]">
                                {change.atividades.map((task) => (
                                  <tr key={task.id} className="hover:bg-[#F2F7FC]">
                                    <td className="py-2 px-2.5 text-center font-mono text-slate-500 font-semibold">{task.ordem}</td>
                                    <td className="py-2 px-2.5 font-semibold text-slate-800 whitespace-nowrap">
                                      {CATEGORY_ICONS[task.categoria]}
                                      <span>{task.categoria}</span>
                                    </td>
                                    <td className="py-2 px-2.5 text-slate-800">{task.descricao}</td>
                                    <td className="py-2 px-2.5 font-mono text-slate-700 whitespace-nowrap tabular-nums">
                                      {task.inicio} → {task.termino}
                                    </td>
                                    <td className="py-2 px-2.5 text-slate-700 whitespace-nowrap">{task.grupoDesignado}</td>
                                    <td className="py-2 px-2.5 text-slate-900 font-medium whitespace-nowrap">{task.responsavel}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Rollback Plan & Tasks Table (Ajuste 1: Tarefas de rollback na Ata) */}
                        {change.rollback && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="text-xs font-bold text-[#003882] uppercase tracking-wider flex items-center gap-1.5">
                                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                                <span>Plano de Rollback e Tarefas de Contingência ({change.rollback.passos.length} passos)</span>
                              </span>
                              <div className="flex items-center gap-2 text-[11px] font-mono">
                                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                                  Tempo Estimado: <strong>{change.rollback.tempoTotalEstimado}</strong>
                                </span>
                                <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-900 border border-rose-200">
                                  Horário Limite (Go/No-Go): <strong>{change.rollback.horarioLimiteDecisao}</strong>
                                </span>
                              </div>
                            </div>

                            {/* Criterio de acionamento alert */}
                            <div className="p-2.5 bg-[#FFFDF7] border border-amber-200 rounded-lg text-xs text-amber-950 flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <div>
                                <strong className="font-bold text-amber-900">Critério de Acionamento do Rollback: </strong>
                                <span>{change.rollback.criterioAcionamento}</span>
                              </div>
                            </div>

                            {/* Rollback Tasks Table */}
                            <div className="overflow-x-auto border border-[#CCE2F2] rounded-lg">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-[#FFF8F0] text-amber-950 border-b border-amber-200">
                                    <th className="py-2 px-2.5 font-bold text-center w-12">Passo</th>
                                    <th className="py-2 px-2.5 font-bold min-w-[200px]">Descrição da Atividade de Rollback</th>
                                    <th className="py-2 px-2.5 font-bold whitespace-nowrap text-center">Tempo Previsto</th>
                                    <th className="py-2 px-2.5 font-bold">Gatilho de Disparo</th>
                                    <th className="py-2 px-2.5 font-bold whitespace-nowrap">Responsável Técnico</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F0E6D8] bg-white">
                                  {change.rollback.passos.map((rbStep) => (
                                    <tr key={rbStep.id} className="hover:bg-[#FFFDF9]">
                                      <td className="py-2 px-2.5 text-center font-mono font-bold text-amber-800">
                                        {rbStep.passo}
                                      </td>
                                      <td className="py-2 px-2.5 font-medium text-slate-800">
                                        {rbStep.descricao}
                                      </td>
                                      <td className="py-2 px-2.5 font-mono text-center text-slate-700 whitespace-nowrap">
                                        {rbStep.tempoEstimado}
                                      </td>
                                      <td className="py-2 px-2.5 text-slate-600 text-[11px]">
                                        {rbStep.gatilho}
                                      </td>
                                      <td className="py-2 px-2.5 text-slate-900 font-medium whitespace-nowrap">
                                        {rbStep.responsavel}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Votes Matrix Table for this change (Ajuste 2: Tabela Votos da Comissão sem nome do votante) */}
                        <div>
                          <span className="text-xs font-bold text-[#003882] uppercase tracking-wider block mb-1.5">
                            Votos da Comissão
                          </span>
                          <div className="overflow-x-auto border border-[#CCE2F2] rounded-lg shadow-2xs">
                            <table className="w-full text-center text-xs border-collapse">
                              <thead>
                                <tr className="bg-[#EBF4FA] text-[#003882] border-b border-[#CCE2F2]">
                                  {(['GEMUD', 'GETIS', 'GEMOL', 'GMIB', 'GEDAN', 'GEROP', 'SUDEC'] as const).map((area) => (
                                    <th key={area} className="py-2 px-2 font-bold font-mono text-center border-r last:border-r-0 border-[#CCE2F2]">
                                      {area}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="bg-white">
                                  {(['GEMUD', 'GETIS', 'GEMOL', 'GMIB', 'GEDAN', 'GEROP', 'SUDEC'] as const).map((area) => {
                                    const voteInfo = change.votos[area] || { vote: 'pendente' };
                                    const badge = getVoteBadge(voteInfo.vote);
                                    const voteLabel = 
                                      voteInfo.vote === 'favoravel' ? 'Favorável' :
                                      voteInfo.vote === 'ressalva' ? 'Com ressalvas' :
                                      voteInfo.vote === 'contrario' ? 'Contrário' :
                                      voteInfo.vote === 'abstencao' ? 'Abstenção' : 'Pendente';

                                    return (
                                      <td key={area} className="py-2.5 px-2 text-center border-r last:border-r-0 border-[#CCE2F2] whitespace-nowrap">
                                        <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold border ${badge.bg}`}>
                                          {voteLabel}
                                        </span>
                                      </td>
                                    );
                                  })}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Ressalvas Registradas formally */}
                        {ressalvasEntries.length > 0 && (
                          <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>Condicionantes e Ressalvas Técnicas Registradas ({ressalvasEntries.length}):</span>
                            </div>
                            <div className="space-y-1 text-xs text-amber-950 pl-2">
                              {ressalvasEntries.map(([area, v]) => (
                                <div key={area} className="leading-snug">
                                  <strong className="font-mono text-[#003882]">{area}: </strong>
                                  <span className="italic">{v.ressalva}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SEÇÃO 4: PLANILHA DE MAPA DE RISCOS (Ajuste 3: Sem coluna justificativa) */}
            <section id="mapa-riscos" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#003882]">
                <span className="w-6 h-6 rounded bg-[#003882] text-white flex items-center justify-center font-bold text-xs font-mono">4</span>
                <h2 className="text-sm sm:text-base font-bold text-[#003882] uppercase tracking-wide">
                  Planilha de Mapa de Riscos das Demandas Apreciadas (Equipe de Mudanças)
                </h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Avaliação matricial quantitativa e qualitativa consolidada pela equipe de governança de mudanças para cálculo de exposição e impacto operacional:
              </p>

              {/* Risk Matrix Table without justificativa column */}
              <div className="overflow-x-auto border border-[#CCE2F2] rounded-lg shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#003882] text-white border-b border-[#002A66]">
                      <th className="py-2.5 px-3 font-bold whitespace-nowrap">ID / Demanda</th>
                      <th className="py-2.5 px-3 font-bold">Sistema / Serviço</th>
                      <th className="py-2.5 px-3 font-bold text-center whitespace-nowrap">Relevância</th>
                      <th className="py-2.5 px-3 font-bold text-center whitespace-nowrap" title="Severidade (1 a 5)">Severidade (S)</th>
                      <th className="py-2.5 px-3 font-bold text-center whitespace-nowrap" title="Probabilidade (1 a 5)">Probabilidade (P)</th>
                      <th className="py-2.5 px-3 font-bold text-center whitespace-nowrap" title="Nível = S x P (1 a 25)">Nível (S×P)</th>
                      <th className="py-2.5 px-3 font-bold text-center whitespace-nowrap">Classificação de Risco</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CCE2F2] bg-white">
                    {changes.map((change) => {
                      const { relevancia, severidade, probabilidade, nivelRisco, classificacaoRisco } = change.analiseRisco;

                      const riscoBadgeClass = 
                        classificacaoRisco === 'Risco Extremo'
                          ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                          : classificacaoRisco === 'Risco Elevado'
                          ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold'
                          : classificacaoRisco === 'Risco Moderado'
                          ? 'bg-blue-100 text-[#003882] border-blue-200 font-semibold'
                          : 'bg-slate-100 text-slate-700 border-slate-200';

                      return (
                        <tr key={change.id} className="hover:bg-[#F2F7FC] transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#003882] whitespace-nowrap">
                            {change.id}
                            <div className="font-sans font-normal text-[11px] text-slate-600 truncate max-w-[200px]" title={change.titulo}>
                              {change.titulo}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            {change.servicoAfetado}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-800 font-medium">
                              {relevancia}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                            {severidade}/5
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                            {probabilidade}/5
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-black text-sm text-[#003882]">
                            {nivelRisco}
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[11px] border font-mono ${riscoBadgeClass}`}>
                              {classificacaoRisco}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Legend of Risk Matrix */}
              <div className="p-3 bg-[#F8FAFD] border border-[#CCE2F2] rounded-lg text-xs flex items-center justify-between flex-wrap gap-2 text-slate-600">
                <span className="font-bold text-[#003882]">Legenda Metodológica BRB:</span>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span>1 a 4: Risco Baixo</span>
                  <span>·</span>
                  <span>5 a 10: Risco Moderado</span>
                  <span>·</span>
                  <span>11 a 16: Risco Elevado</span>
                  <span>·</span>
                  <span>17 a 25: Risco Extremo</span>
                </div>
              </div>
            </section>

            {/* SEÇÃO 5: TABELA DE AGENDA DE IMPLANTAÇÃO */}
            <section id="agenda-implantacao" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#003882]">
                <span className="w-6 h-6 rounded bg-[#003882] text-white flex items-center justify-center font-bold text-xs font-mono">5</span>
                <h2 className="text-sm sm:text-base font-bold text-[#003882] uppercase tracking-wide">
                  Tabela da Agenda Executiva de Implantação (Visão Macro do Fim de Semana)
                </h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visão executiva e cronológica consolidada da escala de implantações, identificando as áreas negociais demandantes, lideranças técnicas e grupos operacionais escalados para o plantão:
              </p>

              <div className="overflow-x-auto border border-[#CCE2F2] rounded-lg shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#EBF4FA] text-[#003882] border-b border-[#CCE2F2]">
                      <th className="py-2.5 px-3 font-bold whitespace-nowrap">Data Prevista / Horário</th>
                      <th className="py-2.5 px-3 font-bold whitespace-nowrap">Nº / ID Demanda</th>
                      <th className="py-2.5 px-3 font-bold whitespace-nowrap">Sistema / Ativo</th>
                      <th className="py-2.5 px-3 font-bold min-w-[200px]">Título da Demanda</th>
                      <th className="py-2.5 px-3 font-bold">Área Negocial</th>
                      <th className="py-2.5 px-3 font-bold">Área Técnica</th>
                      <th className="py-2.5 px-3 font-bold min-w-[180px]">Áreas Executoras</th>
                      <th className="py-2.5 px-3 font-bold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2EEF8] bg-white">
                    {changes.map((change) => {
                      const { dataPrevista, areaNegocial, areaTecnica, areasExecutoras } = change.agendaExecutiva;
                      const hasContrario = Object.values(change.votos).some(v => v.vote === 'contrario');

                      return (
                        <tr key={change.id} className="hover:bg-[#F2F7FC] transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#003882] whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#00A3E0]" />
                              <span>{dataPrevista}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-black text-slate-900 whitespace-nowrap">
                            {change.id}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-[#0055A5] whitespace-nowrap">
                            {change.servicoAfetado}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-900">
                            {change.titulo}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700">
                            {areaNegocial}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 font-medium">
                            {areaTecnica}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex flex-wrap gap-1">
                              {areasExecutoras.map((executor, idx) => (
                                <span 
                                  key={idx} 
                                  className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#F0F6FB] text-[#003882] border border-[#CCE2F2]"
                                >
                                  {executor}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            {hasContrario ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-100 text-rose-800 border border-rose-300">
                                BLOQUEADA
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
                                CONFIRMADA
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Institutional Document Footer */}
          <div className="p-4 bg-[#003882] text-white text-[11px] flex items-center justify-between flex-wrap gap-2">
            <span>BRB - Banco de Brasília S.A. · Gerência de Gestão de Mudanças (GEMUD)</span>
            <span className="font-mono text-sky-200">Documento de Uso Corporativo · Ata Oficial CAB nº {minutes.numeroAta}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
