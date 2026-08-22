import React, { useState } from 'react';
import { ArrowLeft, Lock, Unlock, Send, Sparkles, ChevronRight, RotateCcw, X, ZoomIn } from 'lucide-react';

export default function PartyPage({ onBack }) {
  // 🔑 TON CODE SECRET
  const SECRET_CODE = "2026"; 

  // État pour le zoom de la photo
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false);

  // Liste des messages
  const [messages, setMessages] = useState([
    { id: 1, author: "Marie", text: "Joyeux anniversaire Ernest ! Profite bien de ta journée ! 🎉" },
    { id: 2, author: "Moussa", text: "Bonne fête frérot, que du bonheur et la réussite !" },
    { id: 3, author: "Awa", text: "Un très joyeux anniversaire à toi Ernest !! 🎂✨" }
  ]);

  // Formulaire invités
  const [authorName, setAuthorName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  // Espace secret (Ernest)
  const [inputCode, setInputCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Index du message en cours de lecture
  const [currentIndex, setCurrentIndex] = useState(0);

  // Envoi message invité
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!authorName.trim() || !messageText.trim()) return;

    const newMessage = {
      id: Date.now(),
      author: authorName,
      text: messageText,
    };

    setMessages([...messages, newMessage]);
    setAuthorName('');
    setMessageText('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 4000);
  };

  // Connexion
  const handleLogin = (e) => {
    e.preventDefault();
    if (inputCode === SECRET_CODE) {
      setIsAuthenticated(true);
      setErrorMessage('');
      setCurrentIndex(0);
    } else {
      setErrorMessage('Code incorrect ! Réservé à Ernest ⛔');
    }
  };

  const handleNextMessage = () => {
    if (currentIndex < messages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 flex flex-col items-center max-w-2xl mx-auto">
      {/* Bouton Retour */}
      <button 
        onClick={onBack}
        className="self-start flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" /> Retour au décompte
      </button>

      {/* 🖼️ PHOTO DE FÊTE ARRONDIE À 50% AVEC ZOOM AU CLIC */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8 text-center shadow-2xl flex flex-col items-center">
        <h2 className="text-2xl font-black bg-gradient-to-r from-amber-300 to-pink-500 bg-clip-text text-transparent mb-6 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-400" /> C'est la fête ! 🎉
        </h2>
        
        {/* Vignette ronde cliquable */}
        <div 
          onClick={() => setIsPhotoZoomed(true)}
          className="relative group w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-pink-500/50 p-1 shadow-2xl shadow-pink-500/20 overflow-hidden bg-slate-950 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300"
        >
          <img 
            src="/ernest.jpeg" 
            alt="Ernest" 
            className="w-full h-full object-cover rounded-full"
          />
          {/* Overlay avec icône au survol */}
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-8 h-8 text-white drop-shadow-md" />
          </div>
        </div>
        <p className="text-slate-500 text-xs mt-3">Clique sur la photo pour l'agrandir</p>
      </div>

      {/* 🔍 MODAL DE PREVIEW PHOTO PLEIN ÉCRAN */}
      {isPhotoZoomed && (
        <div 
          onClick={() => setIsPhotoZoomed(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
        >
          <button 
            onClick={() => setIsPhotoZoomed(false)}
            className="absolute top-6 right-6 text-white bg-slate-800/80 hover:bg-slate-700 p-3 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          
          <img 
            src="/ernest.jpeg" 
            alt="Ernest en grand" 
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-slate-700"
            onClick={(e) => e.stopPropagation()} // Évite de fermer en cliquant sur l'image elle-même
          />
        </div>
      )}

      {/* ✍️ ENVOI DE MESSAGE (POUR LES INVITÉS) */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8 shadow-xl">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-amber-300">
          <Send className="w-5 h-5" /> Laisser un message à Ernest
        </h3>
        <p className="text-slate-400 text-sm mb-4">Écris ton mot doux, seul Ernest pourra le lire !</p>

        <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="Ton nom / prénom"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl focus:outline-none focus:border-pink-500"
            required
          />
          <textarea 
            placeholder="Ton message d'anniversaire..."
            rows="3"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl focus:outline-none focus:border-pink-500 resize-none"
            required
          />
          <button 
            type="submit"
            className="py-3 bg-gradient-to-r from-pink-500 to-purple-600 font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" /> Envoyer mon message
          </button>
        </form>

        {sentSuccess && (
          <p className="text-green-400 text-sm text-center mt-3 animate-bounce">
            ✅ Message envoyé avec succès à Ernest !
          </p>
        )}
      </div>

      {/* 🔐 LECTURE MESSAGE PAR MESSAGE (ERNEST) */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        {!isAuthenticated ? (
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-slate-800 rounded-full text-amber-400">
                <Lock className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-bold mb-1">Espace lecture Ernest</h3>
            <p className="text-slate-400 text-xs mb-4">Entre ton code PIN pour découvrir tes messages 1 par 1.</p>

            <form onSubmit={handleLogin} className="flex gap-2 max-w-xs mx-auto">
              <input 
                type="password" 
                placeholder="PIN..."
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-center font-mono focus:outline-none focus:border-pink-500 w-full"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 font-bold rounded-xl border border-slate-700 cursor-pointer"
              >
                OK
              </button>
            </form>
            {errorMessage && <p className="text-red-400 text-xs mt-2">{errorMessage}</p>}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2 text-green-400 font-bold text-sm">
                <Unlock className="w-4 h-4" /> Message {currentIndex + 1} sur {messages.length}
              </span>
              <button 
                onClick={() => setIsAuthenticated(false)} 
                className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                Verrouiller
              </button>
            </div>

            {messages.length > 0 ? (
              <div className="flex flex-col items-center">
                <div className="w-full bg-slate-950 border border-amber-500/30 p-6 rounded-2xl shadow-inner mb-6 text-center transition-all duration-300">
                  <span className="text-xs text-slate-500 uppercase tracking-widest block mb-2">Message de</span>
                  <h4 className="text-2xl font-black text-amber-300 mb-4">{messages[currentIndex].author}</h4>
                  <p className="text-lg text-slate-100 italic leading-relaxed">
                    "{messages[currentIndex].text}"
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 w-full">
                  {currentIndex < messages.length - 1 ? (
                    <button 
                      onClick={handleNextMessage}
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 font-black rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    >
                      <span>Message Suivant</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <p className="text-pink-400 font-bold text-sm w-full text-center mb-2">
                      🎉 C'était le dernier message !
                    </p>
                  )}

                  <button 
                    onClick={handleRestart}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700 text-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Recommencer la lecture</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-center text-slate-500 py-6">Aucun message reçu pour le moment.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}