import { Image } from 'lucide-react';

export default function PhotoWall() {
  // ⚠️ RAPPEL : Place tes images (ex: photo1.jpg) dans le dossier 'public/'
  const photos = [
    { id: 1, url: '/photo1.jpg', alt: 'Souvenir Solo 1' },
    { id: 2, url: '/photo2.jpg', alt: 'Souvenir Solo 2' },
    { id: 3, url: '/photo3.jpg', alt: 'Souvenir Solo 3' },
    { id: 4, url: '/photo4.jpg', alt: 'Souvenir Solo 4' },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8 justify-center">
        <Image className="w-7 h-7 text-purple-400" />
        <h2 className="text-3xl font-black text-white">Ma Section Souvenirs</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-xl hover:-translate-y-2 transition-transform duration-300">
            <img 
              src={photo.url} 
              alt={photo.alt} 
              className="w-full h-56 object-cover rounded-xl"
              // Image par défaut si le fichier n'est pas trouvé
              onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=Image+Manquante'; e.target.onerror = null; }}
            />
            <p className="mt-3 text-center text-sm font-semibold text-slate-300 px-2">{photo.alt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}