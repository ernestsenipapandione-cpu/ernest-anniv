import React, { useState } from 'react';
import Countdown from './components/Countdown'; // Ou ajuster selon la structure de tes fichiers
import PartyPage from './components/PartyPage';

export default function App() {
  const [showParty, setShowParty] = useState(false);

  // 🎯 DATE DU TEST : Aujourd'hui à 21h23
  const now = new Date();
  const testTargetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 29, 0);

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {!showParty ? (
        <div className="flex flex-col items-center gap-6">
          <Countdown targetDate={testTargetDate} />
          
          <button
            onClick={() => setShowParty(true)}
            className="px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition-all cursor-pointer shadow-lg"
          >
            Rejoindre la fête VIP
          </button>
        </div>
      ) : (
        <PartyPage onBack={() => setShowParty(false)} />
      )}
    </main>
  );
}