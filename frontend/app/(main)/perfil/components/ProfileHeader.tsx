'use client';

import { Camera, MapPin, Loader2 } from 'lucide-react';

interface ProfileHeaderProps {
  userId: number | null;
  nombre: string;
  direccion: string;
  imagen: string;
  loading: boolean;
  uploading: boolean;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileHeader({
  userId, nombre, direccion, imagen, loading, uploading, onPhotoChange,
}: ProfileHeaderProps) {
  return (
    <div className="px-8 pb-8 -mt-12 relative flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
        <div className="relative group">
          <label className="w-32 h-32 rounded-[2rem] border-4 border-[#0d111d] bg-indigo-600/20 shadow-2xl flex items-center justify-center text-indigo-400 relative overflow-hidden cursor-pointer">
            <img
              src={imagen || `https://picsum.photos/seed/${userId}/200`}
              alt="Perfil"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
              {uploading ? (
                <Loader2 className="text-white animate-spin" size={24} />
              ) : (
                <>
                  <Camera className="text-white" size={24} />
                  <span className="text-[10px] text-white font-bold uppercase tracking-wider mt-1">Cambiar Foto</span>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPhotoChange}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="mb-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {loading ? 'Cargando...' : nombre || 'Usuario'}
          </h1>
          {direccion && (
            <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
              <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-400"><MapPin size={14} /></span>
              {direccion}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
