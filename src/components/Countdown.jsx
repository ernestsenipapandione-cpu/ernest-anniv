import { useState, useEffect } from 'react';
import { Timer, PartyPopper } from 'lucide-react';

export default function Countdown({ targetDate }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        Jours: Math.floor(difference / (1000 * 60 * 60 * 24)),
        Heures: Math.floor((difference / (1000 * 60 * 60)) % 24),
        Minutes: Math.floor((difference / 1000 / 60) % 60),
        Secondes: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    timerComponents.push(
      <div key={interval} className="flex flex-col items-center p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 min-w-[80px]">
        <span className="text-3xl sm:text-4xl font-black text-amber-300">
          {String(timeLeft[interval]).padStart(2, '0')}
        </span>
        <span className="text-xs uppercase tracking-wider text-pink-100 font-semibold mt-1">
          {interval}
        </span>
      </div>
    );
  });

  const isTimeUp = timerComponents.length === 0;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl shadow-xl text-white max-w-lg mx-auto">
      
      {/* --- TITRE : TEXTE ORIGINAL EN ATTENTE / WOLOF UNE FOIS FINI --- */}
      <div className="flex items-center gap-2 mb-4 text-center">
        {isTimeUp ? (
          <PartyPopper className="w-7 h-7 text-amber-300 animate-bounce" />
        ) : (
          <Timer className="w-6 h-6 text-amber-300 animate-pulse" />
        )}
        <h2 className="text-xl font-black tracking-wide">
          {isTimeUp ? "Heure bi djiotna !" : "Compte à rebours avant la fête !"}
        </h2>
      </div>

      {/* --- AFFICHAGE DU COMPTEUR OU MESSAGE DE FÊTE --- */}
      {!isTimeUp ? (
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {timerComponents}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-center py-4 animate-pulse">
          <span className="text-3xl font-black text-amber-300 tracking-wider">
            🎉 C'est l'heure de faire la fête ! 🎉
          </span>
        </div>
      )}

    </div>
  );
}