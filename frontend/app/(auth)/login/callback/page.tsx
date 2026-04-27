'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userRaw = searchParams.get('user');
    const error = searchParams.get('error');

    if (error || !token) {
      router.replace('/login?error=google_failed');
      return;
    }

    localStorage.setItem('token', token);

    if (userRaw) {
      try {
        const user = JSON.parse(decodeURIComponent(userRaw));
        localStorage.setItem('user', JSON.stringify(user));
      } catch { }
    }

    router.replace('/dashboard');
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0c14]">
      <Loader2 className="text-indigo-400 animate-spin mb-4" size={48} />
      <p className="text-slate-400 font-medium">Iniciando sesión con Google...</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0c14]">
          <Loader2 className="text-indigo-400 animate-spin mb-4" size={48} />
          <p className="text-slate-400 font-medium">Cargando...</p>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
