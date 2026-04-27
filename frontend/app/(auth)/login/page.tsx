'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { fetchApi } from '@/lib/api';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('registered') === 'true')
      setSuccessMsg('Registro exitoso. Por favor, inicia sesión.');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccessMsg(null); setLoading(true);
    try {
      const data = await fetchApi('/login', { requireAuth: false, method: 'POST', body: JSON.stringify(formData) });
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    try {
      const data = await fetchApi('/auth/google', { requireAuth: false });
      if (data.url) window.location.href = data.url;
    } catch {
      setError('Error al intentar conectar con Google');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
      className="glass-card rounded-3xl p-8 max-w-md w-full"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Bienvenido</h1>
        <p className="text-slate-400 mt-2">Ingresa tus credenciales para continuar</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl">{error}</div>}
        {successMsg && <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3 rounded-xl">{successMsg}</div>}

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
            <Input type="password" placeholder="••••••••" className="w-full pl-11 pr-4 input-field"
              value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
          </div>
        </div>

        <Link href="/recuperar" className="text-sm font-medium text-slate-400 hover:text-white transition-colors block ml-auto w-fit">
          ¿Olvidaste tu contraseña?
        </Link>

        <Button type="submit" className="w-full btn-primary flex items-center justify-center gap-2 group" disabled={loading}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Iniciar Sesión'}
          {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-center space-x-4">
        <div className="h-px bg-white/10 flex-1" />
        <span className="text-xs text-slate-500 font-medium">O ingresa con</span>
        <div className="h-px bg-white/10 flex-1" />
      </div>

      <div className="mt-6">
        <Button type="button" variant="outline"
          className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white flex items-center justify-center gap-2 transition-colors py-5"
          onClick={handleGoogleLogin}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </Button>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 text-center">
        <p className="text-slate-400 text-sm">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="text-slate-200 font-semibold hover:underline decoration-white/30 underline-offset-4">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-white">Cargando...</div>}>
      <LoginContent />
    </Suspense>
  );
}
