import React, { useState } from 'react';
import { CABArea, CAB_AREAS_INFO } from '../types/cab';
import { 
  Zap, 
  ChevronDown, 
  Check, 
  Clock,
  CheckCircle2,
  FileText,
  Printer
} from 'lucide-react';

interface HeaderProps {
  currentView: 'triage' | 'minutes';
  onViewChange: (view: 'triage' | 'minutes') => void;
  currentArea: CABArea;
  onAreaChange: (area: CABArea) => void;
  pendingVotesCount: number;
  totalChangesCount: number;
  onPrintMinutes: () => void;
}

const CAB_AREAS_LIST: CABArea[] = ['GEMUD', 'GETIS', 'GEMOL', 'GMIB', 'GEDAN', 'GEROP', 'SUDEC'];

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  currentArea,
  onAreaChange,
  pendingVotesCount,
  totalChangesCount,
  onPrintMinutes,
}) => {
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
  const completedVotesCount = totalChangesCount - pendingVotesCount;

  return (
    <header className="sticky top-0 z-40 bg-[#003882] text-white border-b border-[#002A66] shadow-md print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark / Brand title - BRB Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#002860] border border-[#00A3E0]/50 flex items-center justify-center text-[#00A3E0] shadow-sm font-black font-mono text-sm tracking-tighter">
            BRB
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <span>BRB · Gestão de Mudanças</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#002860] text-sky-200 border border-sky-400/30">
                CAB
              </span>
            </div>
            <div className="text-[11px] text-sky-200/90 font-medium">
              Banco de Brasília · Janela de Fim de Semana
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Switcher between Triage & Meeting Minutes */}
        <div className="flex items-center p-1 bg-[#002860] border border-sky-400/30 rounded-lg text-xs">
          <button
            onClick={() => onViewChange('triage')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'triage'
                ? 'bg-white text-[#003882] shadow-sm'
                : 'text-sky-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Fila Rápida (Speed Triage)</span>
          </button>

          <button
            onClick={() => onViewChange('minutes')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'minutes'
                ? 'bg-white text-[#003882] shadow-sm'
                : 'text-sky-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ata da Reunião (Nº 042/2026)</span>
          </button>
        </div>

        {/* Zone 3: Actions, Voter Identity & Controls */}
        <div className="flex items-center gap-2.5">
          {/* Print PDF Button for Meeting Minutes */}
          {currentView === 'minutes' ? (
            <button
              onClick={onPrintMinutes}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#00A3E0] hover:bg-[#008fc7] text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              title="Imprimir ou Salvar Ata em PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>
          ) : (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#002860] border border-sky-400/30 rounded-lg text-xs text-sky-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-sky-200">Progresso {currentArea}:</span>
              <span className="font-mono font-bold text-white">
                {completedVotesCount}/{totalChangesCount}
              </span>
            </div>
          )}

          {/* Area Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsAreaDropdownOpen(!isAreaDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#002860] hover:bg-[#001f4d] border border-sky-400/40 rounded-lg transition-colors text-left shadow-2xs"
            >
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-sky-200 uppercase tracking-wider font-semibold">
                  Área Votante:
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
