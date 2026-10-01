import React, { useState, useEffect } from 'react';
import { CABArea, CAB_AREAS_INFO, VoteType, ChangeRequest } from '../types/cab';
import { X, Check, AlertTriangle, MinusCircle, AlertCircle, ShieldAlert } from 'lucide-react';

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  change: ChangeRequest;
  currentArea: CABArea;
  onSaveVote: (changeId: string, area: CABArea, vote: VoteType, ressalva?: string) => void;
}

const PRESET_RESSALVAS = [
  'Exigir confirmação de presença do DBA no canal de crise durante o DML.',
  'Validar testes de carga e ausência de locks exclusivos 1h antes da janela.',
  'Garantir que a equipe de redes confirme o monitoramento de portas logo após o switch.',
  'Comunicar formalmente à equipe de atendimento/suporte sobre a janela de instabilidade.',
];

export const VoteModal: React.FC<VoteModalProps> = ({
  isOpen,
  onClose,
  change,
  currentArea,
  onSaveVote,
}) => {
  const currentVote = change.votos[currentArea] || { vote: 'pendente' };
  const [selectedVote, setSelectedVote] = useState<VoteType>(currentVote.vote === 'pendente' ? 'favoravel' : currentVote.vote);
  const [ressalvaText, setRessalvaText] = useState(currentVote.ressalva || '');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedVote(currentVote.vote === 'pendente' ? 'favoravel' : currentVote.vote);
      setRessalvaText(currentVote.ressalva || '');
      setErrorMsg('');
    }
  }, [isOpen, change.id, currentArea]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if ((selectedVote === 'ressalva' || selectedVote === 'contrario') && !ressalvaText.trim()) {
      setErrorMsg(`O registro da justificativa/ressalva técnica é obrigatório para votos ${selectedVote === 'ressalva' ? 'com ressalva' : 'contrários'}.`);
      return;
    }

    onSaveVote(change.id, currentArea, selectedVote, ressalvaText.trim());
    onClose();
  };

  const areaInfo = CAB_AREAS_INFO[currentArea];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-[#CCE2F2] rounded-xl shadow-2xl max-w-xl w-full overflow-hidden">
        {/* Modal Header: Azul Sólido Banco BRB */}
        <div className="p-4 bg-[#003882] text-white border-b border-[#002A66] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-sky-200 font-bold">{change.id}</span>
              <span className="text-sky-300/60">·</span>
              <span className="text-xs text-white font-medium">{change.servicoAfetado}</span>
            </div>
            <h3 className="text-sm font-bold text-white mt-0.5 line-clamp-1">
              Registro de Parecer do Colegiado · BRB CAB
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-sky-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-5">
          {/* Identity banner: Estilo BRB */}
          <div className="p-3 rounded-lg bg-[#EBF4FA] border border-[#CCE2F2] flex items-start gap-3">
            <div className="px-2.5 py-1 rounded bg-[#003882] font-mono font-bold text-xs text-white shrink-0 mt-0.5 shadow-2xs">
              {currentArea}
            </div>
            <div>
              <div className="text-xs font-bold text-[#003882]">{areaInfo.nome}</div>
              <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">{areaInfo.descricao}</div>
            </div>
          </div>

          {/* Vote Options */}
          <div>
            <label className="block text-xs font-bold text-[#003882] mb-2">
              Selecione o seu parecer deliberativo:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setSelectedVote('favoravel'); setErrorMsg(''); }}
                className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
                  selectedVote === 'favoravel'
                    ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-400 text-emerald-900 shadow-2xs'
                    : 'bg-[#F8FAFD] border-[#CCE2F2] text-slate-700 hover:border-[#00A3E0]'
                }`}
              >
                <Check className={`w-4 h-4 shrink-0 mt-0.5 ${selectedVote === 'favoravel' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold">Favorável</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Sem restrições adicionais</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedVote('ressalva'); setErrorMsg(''); }}
                className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
                  selectedVote === 'ressalva'
                    ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-400 text-amber-900 shadow-2xs'
                    : 'bg-[#F8FAFD] border-[#CCE2F2] text-slate-700 hover:border-[#00A3E0]'
                }`}
              >
                <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${selectedVote === 'ressalva' ? 'text-amber-600' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold">Com Ressalva</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Aprovado sob condição técnica</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedVote('contrario'); setErrorMsg(''); }}
                className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
                  selectedVote === 'contrario'
                    ? 'bg-rose-50 border-rose-500 ring-1 ring-rose-400 text-rose-900 shadow-2xs'
                    : 'bg-[#F8FAFD] border-[#CCE2F2] text-slate-700 hover:border-[#00A3E0]'
                }`}
              >
                <ShieldAlert className={`w-4 h-4 shrink-0 mt-0.5 ${selectedVote === 'contrario' ? 'text-rose-600' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold">Contrário (Veto)</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Risco inaceitável ou conflito</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedVote('abstencao'); setErrorMsg(''); }}
                className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
                  selectedVote === 'abstencao'
                    ? 'bg-slate-200 border-slate-400 text-slate-900 shadow-2xs'
                    : 'bg-[#F8FAFD] border-[#CCE2F2] text-slate-700 hover:border-[#00A3E0]'
                }`}
              >
                <MinusCircle className={`w-4 h-4 shrink-0 mt-0.5 ${selectedVote === 'abstencao' ? 'text-slate-700' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold">Abstenção</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Não afeta a área diretamente</div>
                </div>
              </button>
            </div>
          </div>

          {/* Ressalva text input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#003882] flex items-center gap-1.5">
                <span>Ressalva / Condicionante Técnica:</span>
                {(selectedVote === 'ressalva' || selectedVote === 'contrario') && (
                  <span className="text-rose-600 text-[10px] uppercase font-bold">* Obrigatório</span>
                )}
              </label>
              <span className="text-[11px] text-slate-500">Visível para todo o colegiado</span>
            </div>
            <textarea
              value={ressalvaText}
              onChange={(e) => {
                setRessalvaText(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              rows={3}
              placeholder={
                selectedVote === 'ressalva'
                  ? 'Ex: A área concorda desde que o monitoramento seja mantido por 2h após o término...'
                  : selectedVote === 'contrario'
                  ? 'Ex: Voto contrário devido a conflito de janela de I/O de storage com a CHG-2026-0846...'
                  : 'Observações opcionais sobre a mudança...'
              }
              className="w-full px-3 py-2 text-xs bg-[#F8FAFD] border border-[#CCE2F2] rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#003882] focus:ring-1 focus:ring-[#003882]"
            />

            {errorMsg && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick Suggestions for fast voting */}
            <div className="mt-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1 font-semibold">
                Inserção Rápida de Ressalva Comum:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_RESSALVAS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRessalvaText(preset)}
                    className="text-[11px] px-2 py-0.5 bg-[#F0F6FB] hover:bg-[#E2EEF8] text-[#003882] rounded border border-[#CCE2F2] text-left transition-colors truncate max-w-full font-medium"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F8FAFD] border-t border-[#CCE2F2] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 text-xs font-bold text-white bg-[#003882] hover:bg-[#002657] rounded-lg transition-colors shadow-xs"
          >
            Confirmar Parecer de {currentArea}
          </button>
        </div>
      </div>
    </div>
  );
};
