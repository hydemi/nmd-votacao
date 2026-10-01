import React, { useState } from 'react';
import { CABArea, CAB_AREAS_INFO } from '../types/cab';
import { 
  ChevronDown, 
  Check, 
  Clock,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  currentArea: CABArea;
  onAreaChange: (area: CABArea) => void;
  pendingVotesCount: number;
  totalChangesCount: number;
}

const CAB_AREAS_LIST: CABArea[] = ['GEMUD', 'GETIS', 'GEMOL', 'GMIB', 'GEDAN', 'GEROP', 'SUDEC'];

export const Header: React.FC<HeaderProps> = ({
  currentArea,
  onAreaChange,
  pendingVotesCount,
  totalChangesCount,
}) => {
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
  const completedVotesCount = totalChangesCount - pendingVotesCount;

  return (
    <header className="sticky top-0 z-40 bg-[#003882] text-white border-b border-[#002A66] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark / Brand title - BRB Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#002860] border border-[#00A3E0]/50 flex items-center justify-center text-[#00A3E0] shadow-sm font-black font-mono text-sm tracking-tighter">
            BRB
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <span>BRB · CAB Votação Ágil</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#002860] text-sky-200 border border-sky-400/30">
                Speed Triage
              </span>
            </div>
            <div className="text-[11px] text-sky-200/90 font-medium">
              Banco de Brasília · Conselho Consultivo de Mudanças
            </div>
          </div>
        </div>

        {/* Zone 2: Fast Stats / Deliberation Progress */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#002860] border border-sky-400/30 rounded-lg text-sky-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-sky-200">Progresso de {currentArea}:</span>
            <span className="font-mono font-bold text-white">
              {completedVotesCount}/{totalChangesCount} deliberadas
            </span>
          </div>
        </div>

        {/* Zone 3: Active Area Selector & User Controls */}
        <div className="flex items-center gap-2.5">
          {/* Area Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsAreaDropdownOpen(!isAreaDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#002860] hover:bg-[#001f4d] border border-sky-400/40 rounded-lg transition-colors text-left shadow-2xs"
            >
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-sky-200 uppercase tracking-wider font-semibold">
                  Representando Área:
                </span>
                <span className="font-mono text-xs font-bold text-white flex items-center justify-end gap-1">
                  <span>{currentArea}</span>
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-sky-300 transition-transform ${isAreaDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isAreaDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[#CCE2F2] rounded-xl shadow-2xl p-2 z-50 text-slate-900">
                <div className="px-2 py-1.5 text-[11px] font-bold text-[#003882] border-b border-slate-100 mb-1 flex items-center justify-between">
                  <span>Alternar Representação do Colegiado:</span>
                  <span className="text-[10px] text-[#00A3E0] font-mono">7 Áreas</span>
                </div>
                <div className="space-y-1">
                  {CAB_AREAS_LIST.map((code) => {
                    const info = CAB_AREAS_INFO[code];
                    const isSelected = code === currentArea;
                    return (
                      <button
                        key={code}
                        onClick={() => {
                          onAreaChange(code);
                          setIsAreaDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-start justify-between gap-2 transition-colors ${
                          isSelected
                            ? 'bg-[#EBF4FA] text-[#003882] font-bold border border-[#CCE2F2]'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-[#003882]">{code}</span>
                            <span className="text-[10px] text-slate-500 truncate max-w-[150px]">
                              {info.nome}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#003882] shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Pending Votes indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#002860] border border-sky-400/30 text-xs font-mono text-white">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-sky-200 font-sans hidden sm:inline">Pendente:</span>
            <span className={`font-bold ${pendingVotesCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {pendingVotesCount}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
