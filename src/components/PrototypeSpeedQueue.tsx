import React, { useState, useEffect } from 'react';
import { ChangeRequest, CABArea, VoteType } from '../types/cab';
import { ActivitiesTable } from './ActivitiesTable';
import { RollbackCard } from './RollbackCard';
import { VotesSummary, getVoteBadge } from './VotesSummary';
import { 
  Check, 
  AlertTriangle, 
  X, 
  MinusCircle, 
  Search, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  ShieldAlert,
  Layers,
  RotateCcw,
  Users2
} from 'lucide-react';

interface PrototypeSpeedQueueProps {
  changes: ChangeRequest[];
  currentArea: CABArea;
  onSaveVote: (changeId: string, area: CABArea, vote: VoteType, ressalva?: string) => void;
  onOpenVoteModal: (change: ChangeRequest) => void;
}

export const PrototypeSpeedQueue: React.FC<PrototypeSpeedQueueProps> = ({
  changes,
  currentArea,
  onSaveVote,
  onOpenVoteModal,
}) => {
  const [selectedChangeId, setSelectedChangeId] = useState<string>(changes[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'tasks' | 'rollback' | 'quorum'>('tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPendingOnly, setFilterPendingOnly] = useState(false);
  const [filterCriticidade, setFilterCriticidade] = useState<string>('all');

  // Filtered changes list
  const filteredChanges = changes.filter(c => {
    const matchesSearch = 
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.servicoAfetado.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPending = filterPendingOnly ? c.votos[currentArea]?.vote === 'pendente' : true;
    const matchesCriticidade = filterCriticidade === 'all' ? true : c.criticidade === filterCriticidade;

    return matchesSearch && matchesPending && matchesCriticidade;
  });

  // Ensure valid selection
  const selectedChange = changes.find(c => c.id === selectedChangeId) || filteredChanges[0] || changes[0];

  // Hotkey navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const currentIndex = filteredChanges.findIndex(c => c.id === selectedChange?.id);

      if (e.key === 'j' || e.key === 'ArrowDown') {
        if (currentIndex < filteredChanges.length - 1) {
          setSelectedChangeId(filteredChanges[currentIndex + 1].id);
        }
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        if (currentIndex > 0) {
          setSelectedChangeId(filteredChanges[currentIndex - 1].id);
        }
      } else if (e.key === 'a' || e.key === 'A') {
        if (selectedChange) {
          onSaveVote(selectedChange.id, currentArea, 'favoravel');
        }
      } else if (e.key === 'c' || e.key === 'C') {
        if (selectedChange) {
          onOpenVoteModal(selectedChange);
        }
      } else if (e.key === 'r' || e.key === 'R') {
        if (selectedChange) {
          onOpenVoteModal(selectedChange);
        }
      } else if (e.key === 'x' || e.key === 'X') {
        if (selectedChange) {
          onSaveVote(selectedChange.id, currentArea, 'abstencao');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredChanges, selectedChange, currentArea, onSaveVote, onOpenVoteModal]);

  const currentAreaVote = selectedChange?.votos[currentArea] || { vote: 'pendente' };
  const currentBadge = getVoteBadge(currentAreaVote.vote);

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col md:flex-row overflow-hidden bg-[#F2F6FA] text-slate-900">
      {/* Left Pane: Speed Queue List (width 380px) */}
      <div className="w-full md:w-[380px] shrink-0 border-r border-[#CCE2F2] flex flex-col bg-white">
        {/* Search and Filters Header */}
        <div className="p-3 border-b border-[#CCE2F2] space-y-2 bg-[#F8FAFD]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#00A3E0] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por serviço, título ou ID..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#CCE2F2] rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#003882] focus:ring-1 focus:ring-[#003882]"
            />
          </div>

          <div className="flex items-center justify-between gap-1 text-[11px]">
            <button
              onClick={() => setFilterPendingOnly(!filterPendingOnly)}
              className={`px-2 py-1 rounded transition-colors ${
                filterPendingOnly
                  ? 'bg-[#003882] text-white font-semibold shadow-2xs'
                  : 'bg-[#F0F6FB] text-[#003882] hover:bg-[#E2EEF8] border border-[#CCE2F2]'
              }`}
            >
              Pendentes ({changes.filter(c => c.votos[currentArea]?.vote === 'pendente').length})
            </button>

            <select
              value={filterCriticidade}
              onChange={(e) => setFilterCriticidade(e.target.value)}
              className="bg-[#F0F6FB] text-[#003882] border border-[#CCE2F2] rounded px-2 py-1 text-[11px] focus:outline-none font-medium"
            >
              <option value="all">Todas Criticidades</option>
              <option value="Crítica">Crítica</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Padrão">Padrão</option>
            </select>
          </div>
        </div>

        {/* Change items list */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#EAF2F8]">
          {filteredChanges.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              Nenhuma mudança encontrada com os filtros selecionados.
            </div>
          ) : (
            filteredChanges.map((change) => {
              const isSelected = change.id === selectedChange?.id;
              const vote = change.votos[currentArea]?.vote || 'pendente';
              const badge = getVoteBadge(vote);
              const totalVoted = Object.values(change.votos).filter(v => v.vote !== 'pendente').length;
              const hasRessalva = Object.values(change.votos).some(v => v.vote === 'ressalva');
              const hasContrario = Object.values(change.votos).some(v => v.vote === 'contrario');

              return (
                <button
                  key={change.id}
                  onClick={() => setSelectedChangeId(change.id)}
                  className={`w-full text-left p-3 transition-colors flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-[#EBF4FA] border-l-4 border-l-[#003882] shadow-2xs text-slate-900'
                      : 'hover:bg-[#F8FAFD] text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-[#003882]">{change.id}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase ${
                      change.criticidade === 'Crítica'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : change.criticidade === 'Alta'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {change.criticidade}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-900 line-clamp-1">
                    {change.titulo}
                  </div>

                  <div className="text-[11px] text-[#0055A5] font-semibold line-clamp-1">
                    {change.servicoAfetado}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#E8F1F8] text-[10px]">
                    <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                      <Clock className="w-3 h-3 text-[#00A3E0]" />
                      <span>{change.janelaFormatada}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {hasContrario && (
                        <span className="w-2 h-2 rounded-full bg-rose-600" title="Possui voto contrário no colegiado" />
                      )}
                      {hasRessalva && (
                        <span className="w-2 h-2 rounded-full bg-amber-500" title="Possui ressalva registrada" />
                      )}
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <span className="text-slate-500 font-mono">
                        {totalVoted}/7
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Keyboard Helper Footer */}
        <div className="p-2.5 bg-[#F8FAFD] border-t border-[#CCE2F2] text-[11px] text-slate-600 hidden lg:flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-white border border-[#CCE2F2] rounded font-mono text-[#003882] font-bold shadow-2xs">J</span>
            <span className="px-1.5 py-0.5 bg-white border border-[#CCE2F2] rounded font-mono text-[#003882] font-bold shadow-2xs">K</span>
            <span className="text-slate-500">Navegar</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded font-mono text-emerald-700 font-bold shadow-2xs">A</span>
            <span className="text-slate-500">Aprovar</span>
            <span className="px-1.5 py-0.5 bg-amber-50 border border-amber-200 rounded font-mono text-amber-700 font-bold ml-1 shadow-2xs">C</span>
            <span className="text-slate-500">Ressalva</span>
          </div>
        </div>
      </div>

      {/* Right Pane: Inspection & Action View */}
      {selectedChange ? (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F6FA]">
          {/* Change Details Header */}
          <div className="p-4 sm:p-5 bg-white border-b border-[#CCE2F2] shadow-2xs">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-black text-[#003882] text-sm">{selectedChange.id}</span>
                  <span>·</span>
                  <span className="text-[#003882] font-bold">{selectedChange.servicoAfetado}</span>
                  <span>·</span>
                  <span className="font-mono text-emerald-700 font-bold">{selectedChange.janelaFormatada}</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  {selectedChange.titulo}
                </h2>
              </div>

              {/* Current vote indicator */}
              <div className="flex items-center gap-2 bg-[#F0F6FB] border border-[#CCE2F2] px-3 py-1.5 rounded-lg text-xs">
                <span className="text-slate-600 font-medium">Parecer de {currentArea}:</span>
                <span className={`px-2 py-0.5 rounded font-medium border text-xs ${currentBadge.bg}`}>
                  {currentBadge.label}
                </span>
              </div>
            </div>

            {/* Conflict Alert Banner if detected */}
            {selectedChange.conflitoDetectado && (
              <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="font-medium">{selectedChange.conflitoDetectado}</span>
              </div>
            )}

            {/* Description & Impact Summary */}
            <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#F8FAFD] p-3 rounded-lg border border-[#CCE2F2]">
                <span className="text-[11px] font-bold text-[#003882] uppercase tracking-wider block mb-1">
                  Descrição Técnica da Mudança:
                </span>
                <p className="text-slate-700 leading-relaxed">{selectedChange.descricao}</p>
              </div>

              <div className="bg-[#F8FAFD] p-3 rounded-lg border border-[#CCE2F2]">
                <span className="text-[11px] font-bold text-[#003882] uppercase tracking-wider block mb-1">
                  Justificativa & Impacto no Serviço:
                </span>
                <p className="text-slate-700 leading-relaxed mb-2">{selectedChange.justificativaNegocio}</p>
                <div className="text-[11px] text-amber-800 font-semibold">
                  Impacto: {selectedChange.impactoEsperado}
                </div>
              </div>
            </div>

            {/* Sub-Tabs Selector with BRB blue styling */}
            <div className="mt-4 flex items-center gap-2 border-b border-[#CCE2F2] pb-0">
              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-1.5 border-b-2 ${
                  activeTab === 'tasks'
                    ? 'border-[#003882] text-[#003882] bg-[#EBF4FA]'
                    : 'border-transparent text-slate-600 hover:text-[#003882]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#00A3E0]" />
                <span>Relação de Atividades ({selectedChange.atividades.length} tarefas)</span>
              </button>

              <button
                onClick={() => setActiveTab('rollback')}
                className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-1.5 border-b-2 ${
                  activeTab === 'rollback'
                    ? 'border-rose-600 text-rose-700 bg-rose-50/60'
                    : 'border-transparent text-slate-600 hover:text-slate-800'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                <span>Plano de Rollback ({selectedChange.rollback.tempoTotalEstimado})</span>
              </button>

              <button
                onClick={() => setActiveTab('quorum')}
                className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-1.5 border-b-2 ${
                  activeTab === 'quorum'
                    ? 'border-[#003882] text-[#003882] bg-[#EBF4FA]'
                    : 'border-transparent text-slate-600 hover:text-[#003882]'
                }`}
              >
                <Users2 className="w-3.5 h-3.5 text-[#00A3E0]" />
                <span>Votos das 7 Áreas & Ressalvas</span>
              </button>
            </div>
          </div>

          {/* Sub-Tabs Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {activeTab === 'tasks' && (
              <ActivitiesTable tasks={selectedChange.atividades} />
            )}

            {activeTab === 'rollback' && (
              <RollbackCard rollback={selectedChange.rollback} />
            )}

            {activeTab === 'quorum' && (
              <VotesSummary 
                votos={selectedChange.votos} 
                currentArea={currentArea} 
                onOpenVoteModal={() => onOpenVoteModal(selectedChange)} 
              />
            )}
          </div>

          {/* Sticky Fast-Voting Action Bar */}
          <div className="p-3 sm:p-4 bg-white border-t border-[#CCE2F2] flex items-center justify-between flex-wrap gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-700 hidden sm:inline">
                Ação rápida de <strong className="text-[#003882] font-bold">{currentArea}</strong>:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSaveVote(selectedChange.id, currentArea, 'favoravel')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Aprovar [A]</span>
                </button>

                <button
                  onClick={() => onOpenVoteModal(selectedChange)}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Com Ressalva [C]</span>
                </button>

                <button
                  onClick={() => onOpenVoteModal(selectedChange)}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Contrário [R]</span>
                </button>

                <button
                  onClick={() => onSaveVote(selectedChange.id, currentArea, 'abstencao')}
                  className="px-3.5 py-1.5 bg-[#F0F6FB] hover:bg-[#E2EEF8] text-[#003882] rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-[#CCE2F2]"
                >
                  <MinusCircle className="w-3.5 h-3.5 text-[#00A3E0]" />
                  <span>Abster [X]</span>
                </button>
              </div>
            </div>

            {/* Quick Next/Prev buttons */}
            <div className="flex items-center gap-2 text-xs">
              <button
                disabled={filteredChanges.findIndex(c => c.id === selectedChange.id) === 0}
                onClick={() => {
                  const idx = filteredChanges.findIndex(c => c.id === selectedChange.id);
                  if (idx > 0) setSelectedChangeId(filteredChanges[idx - 1].id);
                }}
                className="px-2.5 py-1.5 bg-white border border-[#CCE2F2] rounded-lg text-[#003882] hover:bg-[#F0F6FB] disabled:opacity-40 transition-colors flex items-center gap-1 font-semibold"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#00A3E0]" />
                <span>Anterior</span>
              </button>

              <button
                disabled={filteredChanges.findIndex(c => c.id === selectedChange.id) === filteredChanges.length - 1}
                onClick={() => {
                  const idx = filteredChanges.findIndex(c => c.id === selectedChange.id);
                  if (idx < filteredChanges.length - 1) setSelectedChangeId(filteredChanges[idx + 1].id);
                }}
                className="px-2.5 py-1.5 bg-white border border-[#CCE2F2] rounded-lg text-[#003882] hover:bg-[#F0F6FB] disabled:opacity-40 transition-colors flex items-center gap-1 font-semibold"
              >
                <span>Próxima</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#00A3E0]" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-slate-500 text-sm">
          Selecione uma mudança na lista ao lado para iniciar a análise.
        </div>
      )}
    </div>
  );
};
