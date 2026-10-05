import React, { useState } from 'react';
import { CABArea, ChangeRequest, VoteType, CABMeetingMinutes } from './types/cab';
import { INITIAL_CHANGES } from './data/mockChanges';
import { INITIAL_MEETING_MINUTES } from './data/mockMeetingMinutes';
import { Header } from './components/Header';
import { PrototypeSpeedQueue } from './components/PrototypeSpeedQueue';
import { CABMeetingMinutesView } from './components/CABMeetingMinutesView';
import { VoteModal } from './components/VoteModal';
import { Check, AlertTriangle, X } from 'lucide-react';

export default function App() {
  const [changes, setChanges] = useState<ChangeRequest[]>(INITIAL_CHANGES);
  const [currentArea, setCurrentArea] = useState<CABArea>('GEMUD');
  const [currentView, setCurrentView] = useState<'triage' | 'minutes'>('triage');
  const [meetingMinutes, setMeetingMinutes] = useState<CABMeetingMinutes>(INITIAL_MEETING_MINUTES);
  
  // Modals state
  const [voteModalChange, setVoteModalChange] = useState<ChangeRequest | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSaveVote = (changeId: string, area: CABArea, vote: VoteType, ressalva?: string) => {
    setChanges(prev =>
      prev.map(c => {
        if (c.id !== changeId) return c;
        const now = new Date();
        const timeStr = `Hoje ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        return {
          ...c,
          votos: {
            ...c.votos,
            [area]: {
              vote,
              ressalva: ressalva || undefined,
              autor: `Conselheiro (${area})`,
              dataHora: timeStr,
            },
          },
        };
      })
    );

    const voteDescriptions: Record<VoteType, string> = {
      favoravel: 'Favorável',
      ressalva: 'Com Ressalva',
      contrario: 'Contrário',
      abstencao: 'Abstenção',
      pendente: 'Pendente',
    };

    const type = vote === 'favoravel' ? 'success' : vote === 'ressalva' ? 'warning' : 'error';
    showToast(`Voto ${voteDescriptions[vote]} de ${area} registrado com sucesso para ${changeId}!`, type);
  };

  const handlePrint = () => {
    window.print();
  };

  // Metrics
  const pendingVotesCount = changes.filter(c => c.votos[currentArea]?.vote === 'pendente').length;

  return (
    <div className="min-h-screen bg-[#F2F6FA] font-sans text-slate-900 flex flex-col selection:bg-[#003882]/20 selection:text-[#003882]">
      {/* Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        currentArea={currentArea}
        onAreaChange={(newArea) => {
          setCurrentArea(newArea);
          showToast(`Contexto alterado: Agora atuando como representante de ${newArea}.`, 'success');
        }}
        pendingVotesCount={pendingVotesCount}
        totalChangesCount={changes.length}
        onPrintMinutes={handlePrint}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'triage' ? (
          <PrototypeSpeedQueue
            changes={changes}
            currentArea={currentArea}
            onSaveVote={handleSaveVote}
            onOpenVoteModal={(change) => setVoteModalChange(change)}
          />
        ) : (
          <CABMeetingMinutesView
            minutes={meetingMinutes}
            changes={changes}
            onPrint={handlePrint}
          />
        )}
      </main>

      {/* Floating Toast Notification (Hidden in print) */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 print:hidden">
          <div className={`px-4 py-3 rounded-lg shadow-xl border text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : toastMessage.type === 'warning'
              ? 'bg-amber-50 text-amber-900 border-amber-300'
              : 'bg-rose-50 text-rose-900 border-rose-300'
          }`}>
            {toastMessage.type === 'success' && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
            {toastMessage.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
            {toastMessage.type === 'error' && <X className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Voting Modal */}
      {voteModalChange && (
        <VoteModal
          isOpen={!!voteModalChange}
          onClose={() => setVoteModalChange(null)}
          change={voteModalChange}
          currentArea={currentArea}
          onSaveVote={handleSaveVote}
        />
      )}
    </div>
  );
}
