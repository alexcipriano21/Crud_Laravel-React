'use client';

import { useState, useEffect } from 'react';

export interface CurrentUser {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  imagen?: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  const load = () => {
    const raw = localStorage.getItem('user');
    if (!raw) return;
    try {
      setUser(JSON.parse(raw));
    } catch { }
  };

  useEffect(() => {
    load();
    window.addEventListener('userProfileUpdated', load);
    return () => window.removeEventListener('userProfileUpdated', load);
  }, []);

  const updateLocal = (patch: Partial<CurrentUser>) => {
    const raw = localStorage.getItem('user');
    if (!raw) return;
    try {
      const merged = { ...JSON.parse(raw), ...patch };
      localStorage.setItem('user', JSON.stringify(merged));
      setUser(merged);
      window.dispatchEvent(new Event('userProfileUpdated'));
    } catch { }
  };

  return { user, updateLocal };
}
