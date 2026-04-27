'use client';

import { User as UserIcon, Mail, Phone, MapPin, Loader2, CheckCircle2 } from 'lucide-react';

interface ProfileData {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}

interface ProfileFormProps {
  data: ProfileData;
  loading: boolean;
  saving: boolean;
  success: boolean;
  error: string | null;
  onChange: (field: keyof ProfileData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ProfileForm({ data, loading, saving, success, error, onChange, onSubmit }: ProfileFormProps) {
  return (
    <div className="bento-surface p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
          <UserIcon size={20} />
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">Información de Perfil</h3>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 size={16} /> Perfil actualizado correctamente.
        </div>
      )}

      <form className="space-y-6" onSubmit={onSubmit}>
        {[
          { label: 'Nombre Completo', field: 'nombre' as const, type: 'text', icon: <UserIcon size={16} />, placeholder: '' },
          { label: 'Correo Electrónico', field: 'email' as const, type: 'email', icon: <Mail size={16} />, placeholder: '' },
          { label: 'Teléfono', field: 'telefono' as const, type: 'text', icon: <Phone size={16} />, placeholder: '+1 000 000 0000' },
          { label: 'Dirección', field: 'direccion' as const, type: 'text', icon: <MapPin size={16} />, placeholder: 'Calle, Número, Ciudad' },
        ].map(({ label, field, type, icon, placeholder }) => (
          <div key={field} className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>
              <input
                type={type}
                value={data[field]}
                onChange={e => onChange(field, e.target.value)}
                placeholder={placeholder}
                disabled={loading}
                required={field === 'nombre' || field === 'email'}
                className="bento-input w-full py-3 pl-11"
              />
            </div>
          </div>
        ))}

        <div className="flex pt-4">
          <button
            type="submit"
            disabled={saving || loading}
            className="flex-1 bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Guardar Datos Personales
          </button>
        </div>
      </form>
    </div>
  );
}
