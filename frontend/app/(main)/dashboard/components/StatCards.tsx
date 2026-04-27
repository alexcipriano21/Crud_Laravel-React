"use client";

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, Activity } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface DashboardStats {
  total_usuarios: number;
  total_activos: number;
  total_inactivos: number;
  total_pendientes: number;
}

const SkeletonCard = () => (
  <div className="bento-card p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-800" />
      <div className="w-16 h-6 rounded-full bg-slate-800" />
    </div>
    <div className="space-y-2">
      <div className="w-3/4 h-3 rounded bg-slate-800" />
      <div className="w-1/2 h-7 rounded bg-slate-800" />
    </div>
  </div>
);

export const StatCards = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchApi('/dashboard/stats');
        setStats(data);
      } catch (e: any) {
        setError(e.message || 'Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
        {error}
      </div>
    );
  }

  const cards = [
    { title: 'Usuarios Registrados', value: stats?.total_usuarios ?? 0, badge: 'Total', icon: <Users className="text-blue-500" size={24} />, color: 'bg-blue-500/10', accent: 'text-blue-400 bg-blue-500/10' },
    { title: 'Cuentas Activas',       value: stats?.total_activos ?? 0,   badge: '● Activos',   icon: <Activity className="text-emerald-500" size={24} />, color: 'bg-emerald-500/10', accent: 'text-emerald-400 bg-emerald-500/10' },
    { title: 'Cuentas Inactivas',     value: stats?.total_inactivos ?? 0, badge: '● Inactivos', icon: <TrendingUp className="text-rose-500 rotate-180" size={24} />, color: 'bg-rose-500/10', accent: 'text-rose-400 bg-rose-500/10' },
    { title: 'Cuentas Pendientes',    value: stats?.total_pendientes ?? 0,badge: '● Pendientes',icon: <Activity className="text-amber-500" size={24} />, color: 'bg-amber-500/10', accent: 'text-amber-400 bg-amber-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bento-card p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={card.color + " p-3 rounded-2xl"}>
              {card.icon}
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${card.accent}`}>
              {card.badge}
            </span>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold mb-1 uppercase tracking-wider">{card.title}</p>
            <h3 className="text-3xl font-bold text-white tracking-tight">{card.value}</h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
