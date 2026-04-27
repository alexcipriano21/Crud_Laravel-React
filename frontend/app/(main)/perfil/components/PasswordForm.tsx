'use client';

import { useState } from 'react';
import { ShieldCheck, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface PasswordFormProps {
  userId: number | null;
}

export function PasswordForm({ userId }: PasswordFormProps) {
  const [data, setData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(false);
    if (data.newPassword !== data.confirmPassword) { setError('Las contraseñas nuevas no coinciden.'); return; }
    if (data.newPassword.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    if (!userId) return;
    setSaving(true);
    try {
      await fetchApi(`/usuarios/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ _changePassword: true, password: data.newPassword }),
      });
      setSuccess(true);
      setData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e.message || 'Error al cambiar la contraseña');
    } finally { setSaving(false); }
  };

  return (
    <div className="bento-surface p-8 h-fit">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400">
          <ShieldCheck size={20} />
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">Seguridad</h3>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 size={16} /> Contraseña actualizada correctamente.
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {[
          { label: 'Contraseña Actual', field: 'currentPassword' as const, placeholder: '••••••••••••' },
          { label: 'Nueva Contraseña', field: 'newPassword' as const, placeholder: 'Mínimo 6 caracteres' },
          { label: 'Confirmar Nueva Contraseña', field: 'confirmPassword' as const, placeholder: 'Repite la contraseña' },
        ].map(({ label, field, placeholder }) => (
          <div key={field} className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="password"
                placeholder={placeholder}
                value={data[field]}
                onChange={e => setData(p => ({ ...p, [field]: e.target.value }))}
                required={field !== 'currentPassword'}
                className="bento-input w-full py-3 pl-11"
              />
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-white/5 text-white py-3.5 rounded-xl border border-white/10 font-bold text-sm hover:bg-white/10 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          Cambiar Contraseña
        </button>
      </form>
    </div>
  );
}
