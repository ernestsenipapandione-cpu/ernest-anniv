import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';

export default function ConfettiButton() {
  
  const handleSauce = () => {
    // 1. Tir canon gauche
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6, x: 0 }
    });

    // 2. Tir canon droit
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6, x: 1 }
    });
    
    // 3. Pluie continue du haut
    setTimeout(() => {
      confetti({
        particleCount: 120,
        angle: 90,
        spread: 180,
        origin: { y: 0, x: 0.5 },
        gravity: 0.6,
        ticks: 300,
      });
    }, 400);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleSauce}
        className="px-8 py-4 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-slate-950 font-black text-xl rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 cursor-pointer"
      >
        <Sparkles className="w-6 h-6 fill-slate-950" />
        <span>ENVOYER LA SAUCE ! 🎉</span>
      </button>
      
      <p className="text-sm text-slate-400 font-medium">
        Clique autant de fois que tu veux pour tester l'animation !
      </p>
    </div>
  );
}