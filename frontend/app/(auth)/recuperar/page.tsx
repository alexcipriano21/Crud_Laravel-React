'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowLeft, Loader2, Key, Lock, Copy, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { fetchApi } from '@/lib/api';

export default function RecoveryPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Dev modal
  const [showModal, setShowModal] = useState(false);
  const [devToken, setDevToken] = useState('');
  const [copied, setCopied] = useState(false);

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      const data = await fetchApi('/olvide-password', { requireAuth: false, method: 'POST', body: JSON.stringify({ email }) });
      if (data.reset_token) { setDevToken(data.reset_token); setShowModal(true); }
      else setStep(2);
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally { setLoading(false); }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      await fetchApi('/actualizar-password', { requireAuth: false, method: 'POST', body: JSON.stringify({ email, token, password }) });
      setSuccessMsg('Contraseña actualizada correctamente. Redirigiendo...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally { setLoading(false); }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(devToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closeModal = () => { setShowModal(false); setStep(2); };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
        className="glass-card rounded-3xl p-8 max-w-md w-full relative z-10"
      >
        <div className="mb-8">
          <Link href="/login" className="flex items-center gap-1 text-slate-400 hover:text-white text-sm mb-4 transition-colors group w-fit">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Volver
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight">Recuperar contraseña</h1>
          <p className="text-slate-400 mt-2">
            {step === 1 ? 'Te enviaremos un enlace para restablecer tu contraseña' : 'Ingresa el token y tu nueva contraseña'}
          </p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-4">{error}</div>}
        {successMsg && <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3 rounded-xl mb-4">{successMsg}</div>}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5" onSubmit={handleStep1}>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-300 ml-1">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input type="email" placeholder="tu@ejemplo.com" className="w-full pl-11 pr-4 input-field"
                    value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <Button type="submit" className="w-full btn-primary" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar Instrucciones'}
              </Button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5" onSubmit={handleStep2}>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-300 ml-1">Token de Seguridad</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input type="text" placeholder="Ej. A1B2C3D4" className="w-full pl-11 pr-4 input-field uppercase"
                    value={token} onChange={e => setToken(e.target.value.toUpperCase())} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-300 ml-1">Nueva Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input type="password" placeholder="••••••••" minLength={6} className="w-full pl-11 pr-4 input-field"
                    value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
              </div>
              <Button type="submit" className="w-full btn-primary" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Actualizar Contraseña'}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-slate-400 text-sm">
            ¿Recordaste tu contraseña?{' '}
            <Link href="/login" className="text-slate-200 font-semibold hover:underline decoration-white/30 underline-offset-4">
              Inicia sesión
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Dev Token Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-2xl p-6 relative z-10 w-full max-w-sm border border-white/20 shadow-2xl"
            >
              <h2 className="text-xl font-bold text-white mb-2">Token Generado</h2>
              <p className="text-slate-400 text-sm mb-6">(Solo en desarrollo) Copia este token para el siguiente paso.</p>
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl flex-1 text-center font-mono text-lg text-white font-semibold tracking-wider">
                  {devToken}
                </div>
                <Button type="button" variant="outline" onClick={copyToClipboard}
                  className="bg-white/5 border-white/10 hover:bg-white/10 h-[52px] w-[52px] p-0 shrink-0"
                >
                  {copied ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-slate-300" />}
                </Button>
              </div>
              <Button onClick={closeModal} className="w-full btn-primary bg-indigo-500 hover:bg-indigo-600 border-indigo-400/50">
                Continuar
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
