import React from 'react';
import { CABArea, CAB_AREAS_INFO, AreaVote, VoteType } from '../types/cab';
import { Check, AlertTriangle, X, Clock, MinusCircle, MessageSquare } from 'lucide-react';

interface VotesSummaryProps {
  votos: Record<CABArea, AreaVote>;
  currentArea: CABArea;
  onOpenVoteModal?: () => void;
}

const CAB_AREAS_LIST: CABArea[] = ['GEMUD', 'GETIS', 'GEMOL', 'GMIB', 'GEDAN', 'GEROP', 'SUDEC'];

export const getVoteBadge = (vote: VoteType) => {
  switch (vote) {
    case 'favoravel':
      return {
        label: 'Favorável',
        icon: <Check className="w-3.5 h-3.5" />,
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        text: 'text-emerald-700',
      };
    case 'ressalva':
      return {
        label: 'Com Ressalva',
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
        bg: 'bg-amber-50 text-amber-800 border-amber-300',
        text: 'text-amber-700',
      };
    case 'contrario':
      return {
        label: 'Contrário',
        icon: <X className="w-3.5 h-3.5" />,
        bg: 'bg-rose-50 text-rose-800 border-rose-300',
        text: 'text-rose-700',
      };
    case 'abstencao':
      return {
        label: 'Abstenção',
        icon: <MinusCircle className="w-3.5 h-3.5" />,
        bg: 'bg-slate-100 text-slate-700 border-slate-300',
        text: 'text-slate-600',
      };
    default:
      return {
        label: 'Pendente',
        icon: <Clock className="w-3.5 h-3.5" />,
        bg: 'bg-slate-50 text-slate-500 border-slate-200',
        text: 'text-slate-400',
      };
  }
};

export const VotesSummary: React.FC<VotesSummaryProps> = ({ votos, currentArea, onOpenVoteModal }) => {
  const currentVote = votos[currentArea];
  const totalVotes = Object.values(votos).filter(v => v.vote !== 'pendente').length;
  const ressalvasCount = Object.values(votos).filter(v => v.vote === 'ressalva').length;
  const contrariosCount = Object.values(votos).filter(v => v.vote === 'contrario').length;
  const favoraveisCount = Object.values(votos).filter(v => v.vote === 'favoravel').length;

  return (
    <div className="bg-white border border-[#CCE2F2] rounded-lg p-4 space-y-4 shadow-xs">
      {/* Header and stats */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#CCE2F2]">
        <div>
          <h4 className="text-sm font-bold text-[#003882] flex items-center gap-2">
            <span>Quórum das 7 Áreas Colegiadas</span>
            <span className="font-mono text-xs text-slate-500 font-normal">
              ({totalVotes}/7 deliberados)
            </span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Decisão colegiada com registro formal de pareceres técnicos e salvaguardas.
          </p>
        </div>

        {/* Quick summary indicators */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-emerald-700 font-semibold">✓ {favoraveisCount} Fav</span>
          {ressalvasCount > 0 && (
            <span className="text-amber-700 font-semibold">⚠ {ressalvasCount} Ressalva{ressalvasCount > 1 ? 's' : ''}</span>
          )}
          {contrariosCount > 0 && (
            <span className="text-rose-700 font-semibold">✕ {contrariosCount} Contrário{contrariosCount > 1 ? 's' : ''}</span>
          )}
          <span className="text-slate-500 font-medium">⏱ {7 - totalVotes} Pend</span>
        </div>
      </div>

      {/* Grid of the 7 Areas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {CAB_AREAS_LIST.map((areaCode) => {
          const areaInfo = CAB_AREAS_INFO[areaCode];
          const voteData = votos[areaCode] || { vote: 'pendente' };
          const badge = getVoteBadge(voteData.vote);
          const isUserArea = areaCode === currentArea;

          return (
            <div
              key={areaCode}
              className={`p-3 rounded-lg border transition-all ${
                isUserArea 
                  ? 'bg-[#EBF4FA] border-[#003882] ring-1 ring-[#00A3E0]/40 shadow-xs' 
                  : 'bg-white border-[#CCE2F2] hover:border-[#00A3E0]/60'
              }`}
            >
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs font-mono text-[#003882]">
                    {areaCode}
                  </span>
                  {isUserArea && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-[#003882] text-white rounded font-bold shadow-2xs">
                      Sua Área
                    </span>
                  )}
                </div>
                <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border font-medium ${badge.bg}`}>
                  {badge.icon}
                  <span>{badge.label}</span>
                </span>
              </div>

              <div className="text-[11px] text-slate-600 line-clamp-1" title={areaInfo.nome}>
                {areaInfo.nome}
              </div>

              {voteData.autor && (
                <div className="mt-1 text-[10px] text-slate-500 font-mono">
                  Por {voteData.autor} · {voteData.dataHora}
                </div>
              )}

              {/* Ressalva preview if present */}
              {voteData.ressalva && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 leading-tight">
                  <div className="font-semibold text-amber-800 flex items-center gap-1 mb-0.5">
                    <MessageSquare className="w-3 h-3 text-amber-600" />
                    <span>Ressalva registrada:</span>
                  </div>
                  <p className="italic font-sans text-amber-950">{voteData.ressalva}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Direct Call to Action for User's Area */}
      <div className="p-3 bg-[#EBF4FA] border border-[#CCE2F2] rounded-lg flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00A3E0] animate-pulse" />
          <span className="text-[#003882]">
            Você está autenticado como representante da área <strong className="text-[#003882] font-mono font-bold">{currentArea}</strong>.
          </span>
          <span className="text-slate-600">
            Seu voto atual: <strong className={getVoteBadge(currentVote?.vote || 'pendente').text}>{getVoteBadge(currentVote?.vote || 'pendente').label}</strong>
          </span>
        </div>
        {onOpenVoteModal && (
          <button
            onClick={onOpenVoteModal}
            className="px-3.5 py-1.5 bg-[#003882] hover:bg-[#002B66] text-white rounded font-bold text-xs transition-colors shadow-xs"
          >
            {currentVote?.vote === 'pendente' ? 'Emitir Parecer / Votar' : 'Alterar Meu Voto'}
          </button>
        )}
      </div>
    </div>
  );
};
