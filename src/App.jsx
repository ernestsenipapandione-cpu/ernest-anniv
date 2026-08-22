import React, { useState, useEffect } from 'react';
import Countdown from './components/Countdown';
import PartyPage from './components/PartyPage';
import { Sparkles, Lock } from 'lucide-react';

export default function App() {
  // ⚠️ TA DATE D'ANNIVERSAIRE
  const targetDate = "2026-08-23T00:00:00";

  const [currentPage, setCurrentPage] = useState('home');
  // 🔒 REVERROUILLÉ : Passe automatiquement à true quand le décompte atteint zéro
  const [isPartyTime, setIsPartyTime] = useState(false);

  // Vérification si le décompte est terminé
  useEffect(() => {
    const checkTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setIsPartyTime(true);
      }
    };

    checkTime();
    const timer = setInterval(checkTime, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (currentPage === 'party') {
    return <PartyPage onBack={() => setCurrentPage('home')} />;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white py-10 px-4 flex flex-col items-center justify-center">
      {/* Titre & Décompte */}
      <div className="text-center mb-10 w-full max-w-xl">
        <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-amber-300 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-3">
          Bayil eupeul té kharr heure bi djott ! 🎂
        </h1>
        <p className="text-slate-400 text-sm mb-6">Le compte à rebours est lancé...</p>
        <Countdown targetDate={targetDate} />
      </div>

      {/* Bouton Verrouillé / Déverrouillé */}
      <div>
        <button
          onClick={() => {
            if (isPartyTime) {
              setCurrentPage('party');
            } else {
              alert("⏳ Pas si vite Ernest ! Attends que le compte à rebours atteigne zéro pour envoyer la sauce !");
            }
          }}
          disabled={!isPartyTime}
          className={`px-8 py-4 font-black text-xl rounded-full shadow-2xl transition-all duration-300 flex items-center gap-3 ${
            isPartyTime
              ? 'bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-slate-950 hover:scale-105 active:scale-95 cursor-pointer animate-pulse'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-75'
          }`}
        >
          {isPartyTime ? (
            <>
              <Sparkles className="w-6 h-6 fill-slate-950 animate-bounce" />
              <span>ENVOYER LA SAUCE ! 🎉</span>
            </>
          ) : (
            <>
              <Lock className="w-6 h-6 text-slate-500" />
              <span>BOUTON VERROUILLÉ ⏳</span>
            </>
          )}
        </button>
      </div>
    </main>
  );
}