import React from 'react';
import { RollbackPlan } from '../types/cab';
import { RotateCcw, AlertTriangle, Clock, ShieldAlert, CheckCircle } from 'lucide-react';

interface RollbackCardProps {
  rollback: RollbackPlan;
}

export const RollbackCard: React.FC<RollbackCardProps> = ({ rollback }) => {
  return (
    <div className="bg-white border border-[#CCE2F2] rounded-lg overflow-hidden shadow-xs">
      {/* Header with key metrics */}
      <div className="p-4 bg-slate-50 border-b border-[#CCE2F2]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-2xs">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Plano de Rollback & Contingência de Execução</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-100 text-rose-700 border border-rose-200 font-bold">
                  Obrigatório no CAB
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Procedimento técnico validado para restabelecimento do serviço em caso de anomalia.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="bg-white border border-[#CCE2F2] px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <div>
                <span className="text-slate-500 text-[11px] block">Tempo de Retorno:</span>
                <span className="font-bold text-slate-900 font-mono">{rollback.tempoTotalEstimado}</span>
              </div>
            </div>

            <div className="bg-white border border-[#CCE2F2] px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-2xs">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <div>
                <span className="text-slate-500 text-[11px] block">Horário Limite (Go/No-Go):</span>
                <span className="font-bold text-rose-700 font-mono">{rollback.horarioLimiteDecisao}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trigger condition banner */}
        <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-rose-800">Critério de Acionamento Obrigatório: </span>
            <span className="text-rose-950">{rollback.criterioAcionamento}</span>
          </div>
        </div>
      </div>

      {/* Sequential Rollback Steps */}
      <div className="p-4">
        <h4 className="text-xs font-bold text-[#003882] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-[#00A3E0]" />
          <span>Passos Sequenciais de Reversão</span>
        </h4>

        <div className="space-y-2">
          {rollback.passos.map((passo) => (
            <div 
              key={passo.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-[#F8FAFD] border border-[#CCE2F2] hover:border-[#00A3E0]/60 transition-colors"
            >
              <div className="w-6 h-6 rounded bg-[#003882] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 shadow-2xs">
                {passo.passo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-900 leading-relaxed">
                  {passo.descricao}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                  <div>
                    <span className="text-slate-500">Responsável: </span>
                    <span className="text-slate-900 font-bold">{passo.responsavel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Gatilho: </span>
                    <span className="text-slate-700">{passo.gatilho}</span>
                  </div>
                </div>
              </div>
              <div className="font-mono text-xs text-amber-800 shrink-0 bg-amber-50 px-2 py-1 rounded border border-amber-200 font-bold">
                {passo.tempoEstimado}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
