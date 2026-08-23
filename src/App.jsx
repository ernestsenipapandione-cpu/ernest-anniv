import React, { useState } from 'react';
import Countdown from './components/Countdown';
import PartyPage from './components/PartyPage';

export default function App() {
  const [showParty, setShowParty] = useState(false);

  // 🎯 METS TA VRAIE DATE ET HEURE D'ANNIVERSAIRE ICI (Exemple: 25 Août 2026 à 00:00:00)
  // Format : new Date('YYYY-MM-DDTHH:mm:ss')
  const birthdayDate = new Date('2026-08-25T00:00:00');

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {!showParty ? (
        <div className="flex flex-col items-center gap-6">
          <Countdown targetDate={birthdayDate} />
          
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