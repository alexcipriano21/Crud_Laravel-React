'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { useCurrentUser } from '@/lib/hooks';
import { ProfileHeader } from './ProfileHeader';
import { ProfileForm } from './ProfileForm';
import { PasswordForm } from './PasswordForm';

type ProfileData = { nombre: string; email: string; telefono: string; direccion: string; imagen: string; };

export const ProfileSettings = () => {
  const router = useRouter();
  const { user, updateLocal } = useCurrentUser();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [data, setData] = useState<ProfileData>({
    nombre: '', email: '', telefono: '', direccion: '', imagen: '',
  });

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchApi(`/usuarios/${user.id}`)
      .then(d => setData({
        nombre: d.nombre ?? '', email: d.email ?? '',
        telefono: d.telefono ?? '', direccion: d.direccion ?? '',
        imagen: d.imagen ?? '',
      }))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true); setError(null); setSuccess(false);
    try {
      const current = await fetchApi(`/usuarios/${user.id}`);
      await fetchApi(`/usuarios/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...data,
          rol: current.rol, estado: current.estado,
          check_verificado: current.check_verificado,
          imagen: current.imagen ?? null,
        }),
      });
      updateLocal({ nombre: data.nombre, email: data.email });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e.message || 'Error al actualizar perfil');
    } finally { setSaving(false); }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true); setError(null);
    try {
      const fileName = `${user.id}-${Math.random()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage.from('Perfil_Laravel').upload(fileName, file);
      if (uploadError) throw uploadError;

      const publicUrl = supabase.storage.from('Perfil_Laravel').getPublicUrl(fileName).data.publicUrl;
      const current = await fetchApi(`/usuarios/${user.id}`);
      await fetchApi(`/usuarios/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...current, imagen: publicUrl }),
      });

      setData(p => ({ ...p, imagen: publicUrl }));
      updateLocal({ imagen: publicUrl });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e.message || 'Error al subir la foto');
    } finally { setUploading(false); }
  };

  return (
    <div className="space-y-8 pb-12">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bento-surface overflow-hidden relative">
        <div className="h-40 w-full bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0d111d] to-transparent" />
        </div>
        <ProfileHeader
          userId={user?.id ?? null}
          nombre={data.nombre}
          direccion={data.direccion}
          imagen={data.imagen}
          loading={loading}
          uploading={uploading}
          onPhotoChange={handlePhotoUpload}
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <ProfileForm
            data={data}
            loading={loading}
            saving={saving}
            success={success}
            error={error}
            onChange={(field, value) => setData(p => ({ ...p, [field]: value }))}
            onSubmit={handleSave}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <PasswordForm userId={user?.id ?? null} />
        </motion.div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); router.push('/login'); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-sm font-medium"
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </div>
  );
};
