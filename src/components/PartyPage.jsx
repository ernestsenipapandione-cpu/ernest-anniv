import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Code2, Terminal, Sparkles, Plus, Send, RefreshCw } from 'lucide-react';

export default function PartyPage({ onBack }) {
  const [messages, setMessages] = useState([
    {
      author: "La Team",
      text: "hbd wadji doudal lou beurri !"
    },
    {
      author: "</>",
      text: "A tes 100ans bro"
    },
    {
      author: "astou",
      text: "hbd lakal enjoy your day"
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [newAuthor, setNewAuthor] = useState('');
  const [newText, setNewText] = useState('');

  useEffect(() => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const handleNextMessage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  const handleAddMessage = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const addedMsg = {
      author: newAuthor.trim() || 'Un(e) Ami(e)',
      text: newText.trim()
    };

    setMessages([...messages, addedMsg]);
    setNewAuthor('');
    setNewText('');
    setCurrentIndex(messages.length);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden p-4 sm:p-6">
      <div className="relative z-10 max-w-2xl w-full bg-slate-900/95 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-10 text-center shadow-[0_0_60px_rgba(251,191,36,0.25)] backdrop-blur-md">
        
        {/* Photo de profil ronde (50% radius / rounded-full) avec contour lumineux */}
        <div className="relative mx-auto w-32 h-32 mb-6">
          <img 
            src="/ernest.jpeg" 
            alt="Ernest" 
            className="w-32 h-32 rounded-full object-cover border-4 border-amber-400 shadow-xl shadow-amber-500/20"
            onError={(e) => { 
              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'; 
              e.target.onerror = null; 
            }}
          />
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-400 to-pink-500 p-2 rounded-full shadow-lg">
            <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950" />
          </div>
        </div>

        {/* Badge header */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400/10 border border-amber-400/30 rounded-full mb-4">
          <Code2 className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Special Commit for Ernest
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-amber-300 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-6 tracking-tight">
          JOYEUX ANNIVERSAIRE ERNEST ! 🎂
        </h1>

        {/* SECTION Message Interactif */}
        <div className="mb-8">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2 flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Clique sur la carte pour lire le message suivant ({currentIndex + 1}/{messages.length})
          </p>

          <div 
            onClick={handleNextMessage}
            className="bg-slate-950/90 p-6 rounded-2xl border-2 border-slate-700 hover:border-pink-500 transition-all cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] relative group text-left"
          >
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-sm font-bold text-pink-400 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-green-400" />
                De : {messages[currentIndex].author}
              </span>
              <RefreshCw className="w-4 h-4 text-slate-500 group-hover:rotate-180 transition-transform duration-500" />
            </div>

            <p className="text-slate-100 font-semibold text-lg sm:text-xl leading-relaxed">
              "{messages[currentIndex].text}"
            </p>
          </div>
        </div>

        {/* SECTION Ajouter un message */}
        <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 mb-8 text-left">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" />
            Laisser un mot pour Ernest
          </h3>

          <form onSubmit={handleAddMessage} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Ton nom / pseudo "
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-amber-400 transition-colors"
            />
            <textarea
              rows="2"
              placeholder="Écris ton message d'anniv ici..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-amber-400 transition-colors resize-none"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Ajouter mon message</span>
            </button>
          </form>
        </div>

        {/* Bouton retour */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Revoir le décompte
        </button>

      </div>
    </div>
  );
}