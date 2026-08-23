import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Lock, Unlock, Send, Sparkles, ChevronRight, RotateCcw, X, ZoomIn, History, ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

// --- FOND MATRIX VERT ---
function MatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 15;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#22c55e'; 
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#15803d';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-50" />;
}

// --- CARTE À GRATTER ---
function ScratchCard({ author, text, onScratched }) {
  const canvasRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f59e0b');
    gradient.addColorStop(0.5, '#fef08a');
    gradient.addColorStop(1, '#d97706');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ GRATTE ICI POUR DÉCOUVRIR ✨', canvas.width / 2, canvas.height / 2);

    setIsRevealed(false);
  }, [author, text]);

  const scratch = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x - rect.left, y - rect.top, 25, 0, Math.PI * 2);
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparentPixels++;
    }

    if (transparentPixels / (imageData.data.length / 4) > 0.35 && !isRevealed) {
      setIsRevealed(true);
      if (onScratched) onScratched();
    }
  };

  return (
    <div className="relative w-full bg-slate-950/90 border border-amber-500/40 rounded-2xl overflow-hidden min-h-[200px] flex items-center justify-center p-6 shadow-inner">
      <div className="text-center w-full select-none">
        <span className="text-xs text-slate-500 uppercase tracking-widest block mb-2">Message de</span>
        <h4 className="text-2xl font-black text-amber-300 mb-3">{author}</h4>
        <p className="text-lg text-slate-100 italic leading-relaxed">"{text}"</p>
      </div>

      {!isRevealed && (
        <canvas
          ref={canvasRef}
          onMouseMove={(e) => e.buttons === 1 && scratch(e.clientX, e.clientY)}
          onTouchMove={(e) => scratch(e.touches[0].clientX, e.touches[0].clientY)}
          className="absolute inset-0 w-full h-full cursor-pointer touch-none z-10 transition-opacity duration-500"
        />
      )}
    </div>
  );
}

// --- PAGE PRINCIPALE ---
export default function PartyPage({ onBack }) {
  const SECRET_CODE = "2026";
  const [messages, setMessages] = useState([]);

  // 📡 SYNCHRONISATION TEMPS RÉEL DEPUIS FIREBASE
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, []);

  const [curtainOpen, setCurtainOpen] = useState(false);
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const flashbackPhotos = [
    { url: '/ernest.jpeg', title: 'Aujourd\'hui 🎂' },
    
    { url: '/ernest2.jpeg', title: 'Toute Petite Enfance 👶' }
  ];

  const triggerConfetti = () => {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6, x: 0.1 } });
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6, x: 0.9 } });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurtainOpen(true);
      triggerConfetti();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const [authorName, setAuthorName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const [inputCode, setInputCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // 📤 ENVOYER LE MESSAGE VERS FIREBASE
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!authorName.trim() || !messageText.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        author: authorName,
        text: messageText,
        createdAt: serverTimestamp()
      });

      setAuthorName('');
      setMessageText('');
      setSentSuccess(true);
      triggerConfetti();
      setTimeout(() => setSentSuccess(false), 4000);
    } catch (err) {
      console.error("Erreur d'envoi : ", err);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (inputCode === SECRET_CODE) {
      setIsAuthenticated(true);
      setErrorMessage('');
      setCurrentIndex(0);
      triggerConfetti();
    } else {
      setErrorMessage('Code incorrect ! Réservé à Ernest ⛔');
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white p-4 sm:p-6 flex flex-col items-center max-w-2xl mx-auto overflow-hidden">
      <MatrixBackground />

      {/* RIDEAU ROUGE */}
      <div className={`fixed inset-0 z-50 pointer-events-none flex transition-transform duration-1000 ease-in-out ${curtainOpen ? 'translate-y-[-100%]' : 'translate-y-0'}`}>
        <div className="w-1/2 h-full bg-gradient-to-r from-red-900 to-red-600 border-r-4 border-amber-400 shadow-2xl flex items-center justify-end pr-4"><span className="text-4xl">👑</span></div>
        <div className="w-1/2 h-full bg-gradient-to-l from-red-900 to-red-600 border-l-4 border-amber-400 shadow-2xl flex items-center justify-start pl-4"><span className="text-4xl">👑</span></div>
      </div>

      <button onClick={onBack} className="self-start flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors cursor-pointer relative z-10">
        <ArrowLeft className="w-5 h-5" /> Retour au décompte
      </button>

      {/* GALERIE */}
      <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 mb-8 text-center shadow-2xl flex flex-col items-center relative z-10">
        <h2 className="text-2xl font-black bg-gradient-to-r from-amber-300 to-pink-500 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-400 animate-spin" /> VIP Red Carpet - Ernest 🎉
        </h2>
        
        <p className="text-xs text-amber-400/80 mb-6 flex items-center gap-1">
          <History className="w-4 h-4" /> Machine à Remonter le Temps : {flashbackPhotos[currentPhotoIndex].title}
        </p>

        <div className="relative flex items-center justify-center w-full">
          <button onClick={() => setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : flashbackPhotos.length - 1))} className="absolute left-0 z-20 p-2 bg-slate-800/80 rounded-full text-white cursor-pointer"><ChevronLeft className="w-6 h-6" /></button>
          <div onClick={() => { setIsPhotoZoomed(true); triggerConfetti(); }} className="relative group w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-amber-400 p-1 shadow-[0_0_50px_rgba(251,191,36,0.3)] overflow-hidden bg-slate-950 flex items-center justify-center cursor-pointer">
            <img src={flashbackPhotos[currentPhotoIndex].url} alt="Ernest" className="w-full h-full object-cover rounded-full" />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ZoomIn className="w-8 h-8 text-white" /></div>
          </div>
          <button onClick={() => setCurrentPhotoIndex((prev) => (prev < flashbackPhotos.length - 1 ? prev + 1 : 0))} className="absolute right-0 z-20 p-2 bg-slate-800/80 rounded-full text-white cursor-pointer"><ChevronRight className="w-6 h-6" /></button>
        </div>
      </div>

      {/* ZOOM PHOTO */}
      {isPhotoZoomed && (
        <div onClick={() => setIsPhotoZoomed(false)} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer">
          <button onClick={() => setIsPhotoZoomed(false)} className="absolute top-6 right-6 text-white bg-slate-800/80 p-3 rounded-full"><X className="w-6 h-6" /></button>
          <img src={flashbackPhotos[currentPhotoIndex].url} alt="Ernest en grand" className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-slate-700" />
        </div>
      )}

      {/* ENVOI MESSAGE */}
      <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 mb-8 shadow-xl relative z-10">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-amber-300"><Send className="w-5 h-5" /> Laisser un message à Ernest</h3>
        <p className="text-slate-400 text-sm mb-4">Ton mot sera recouvert d'une couche dorée mystère à gratter !</p>

        <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
          <input type="text" placeholder="Ton nom / prénom" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="px-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-500" required />
          <textarea placeholder="Ton message d'anniversaire..." rows="3" value={messageText} onChange={(e) => setMessageText(e.target.value)} className="px-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 resize-none" required />
          <button type="submit" className="py-3 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-slate-950 font-black rounded-xl hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer"><Send className="w-4 h-4" /> Envoyer mon message</button>
        </form>
        {sentSuccess && <p className="text-green-400 text-sm text-center mt-3 animate-bounce">✅ Message enregistré en direct ! 🎉</p>}
      </div>

      {/* ESPACE GRATTE */}
      <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl mb-8 relative z-10">
        {!isAuthenticated ? (
          <div className="text-center">
            <div className="flex justify-center mb-3"><div className="p-3 bg-slate-800 rounded-full text-amber-400"><Lock className="w-6 h-6" /></div></div>
            <h3 className="text-lg font-bold mb-1">Espace Grattage VIP Ernest</h3>
            <p className="text-slate-400 text-xs mb-4">Entre ton PIN pour gratter tes messages.</p>
            <form onSubmit={handleLogin} className="flex gap-2 max-w-xs mx-auto">
              <input type="password" placeholder="PIN..." value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="px-4 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-center font-mono focus:outline-none focus:border-amber-500 w-full" />
              <button type="submit" className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 cursor-pointer">OK</button>
            </form>
            {errorMessage && <p className="text-red-400 text-xs mt-2">{errorMessage}</p>}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2 text-amber-400 font-bold text-sm"><Unlock className="w-4 h-4" /> Ticket {currentIndex + 1} sur {messages.length}</span>
              <button onClick={() => setIsAuthenticated(false)} className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer">Verrouiller</button>
            </div>

            {messages.length > 0 ? (
              <div className="flex flex-col items-center">
                <ScratchCard key={messages[currentIndex].id} author={messages[currentIndex].author} text={messages[currentIndex].text} onScratched={triggerConfetti} />
                <div className="flex flex-wrap justify-center gap-3 w-full mt-6">
                  {currentIndex < messages.length - 1 ? (
                    <button onClick={() => { setCurrentIndex(currentIndex + 1); triggerConfetti(); }} className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 font-black rounded-xl hover:scale-105 flex items-center justify-center gap-2 cursor-pointer shadow-lg"><span>Ticket Suivant</span><ChevronRight className="w-5 h-5" /></button>
                  ) : (
                    <p className="text-pink-400 font-bold text-sm w-full text-center mb-2">🎉 Tu as gratté tous tes tickets !</p>
                  )}
                  <button onClick={() => setCurrentIndex(0)} className="px-4 py-3 bg-slate-800 text-slate-300 font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer border border-slate-700 text-sm"><RotateCcw className="w-4 h-4" /><span>Recommencer</span></button>
                </div>
              </div>
            ) : (
              <p className="text-center text-slate-500 py-6">Aucun message pour le moment.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}