'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { fetchApi } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      await fetchApi('/registrar', { requireAuth: false, method: 'POST', body: JSON.stringify(formData) });
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
      className="glass-card rounded-3xl p-8 max-w-md w-full"
    >
      <div className="mb-8">
        <Link href="/login" className="flex items-center gap-1 text-slate-400 hover:text-white text-sm mb-4 transition-colors group w-fit">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Volver
        </Link>
        <h1 className="text-3xl font-bold text-white tracking-tight">Crear cuenta</h1>
        <p className="text-slate-400 mt-2">Completa tus datos para unirte</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl">{error}</div>}

        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-300 ml-1">Nombre Completo</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input type="text" placeholder="Juan Pérez" className="w-full pl-11 pr-4 input-field"
              value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-300 ml-1">Correo Electrónico</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input type="email" placeholder="tu@ejemplo.com" className="w-full pl-11 pr-4 input-field"
              value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-300 ml-1">Contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input type="password" placeholder="••••••••" minLength={6} className="w-full pl-11 pr-4 input-field"
              value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
          </div>
        </div>

        <Button className="w-full btn-primary mt-2" disabled={loading}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Registrarse'}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/10 text-center">
        <p className="text-slate-400 text-sm">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="text-slate-200 font-semibold hover:underline decoration-white/30 underline-offset-4">
            Inicia sesión
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
