"use client";

import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { fetchApi } from '@/lib/api';

const ROLE_COLORS: Record<string, string> = {
  colaborador: '#6366f1',
  editor: '#8b5cf6',
  supervisor: '#ec4899',
};

const tooltipStyle = {
  contentStyle: {
    backgroundColor: '#0d111d',
    borderRadius: '12px',
    border: '1px solid #1e293b',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
  },
  itemStyle: { color: '#fff' },
};

const SkeletonChart = () => (
  <div className="bento-surface p-6 animate-pulse">
    <div className="w-40 h-5 rounded bg-slate-800 mb-6" />
    <div className="h-[300px] w-full rounded-xl bg-slate-800/50" />
  </div>
);

export const MainCharts = () => {
  const [meses, setMeses] = useState<{ name: string; total: number }[]>([]);
  const [roles, setRoles] = useState<{ name: string; total: number; color: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchApi('/dashboard/charts');

        const mesLabels: Record<string, string> = {
          '01': 'Ene', '02': 'Feb', '03': 'Mar', '04': 'Abr',
          '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Ago',
          '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dic',
        };
        const mesesMapped = (data.por_mes || []).map((item: any) => ({
          name: mesLabels[item.mes?.split('-')[1]] ?? item.mes,
          total: Number(item.total),
        }));

        const rolesMapped = (data.por_rol || []).map((item: any) => ({
          name: item.rol.charAt(0).toUpperCase() + item.rol.slice(1),
          total: Number(item.total),
          color: ROLE_COLORS[item.rol] ?? '#64748b',
        }));

        setMeses(mesesMapped);
        setRoles(rolesMapped);
      } catch (e: any) {
        setError(e.message || 'Error al cargar gráficos');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SkeletonChart />
        <SkeletonChart />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bento-surface p-6"
      >
        <h4 className="text-lg font-medium text-white mb-6">Crecimiento de Usuarios</h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={meses}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bento-surface p-6"
      >
        <h4 className="text-lg font-medium text-white mb-6">Gráfica de Usuarios por Rol</h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roles}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                {...tooltipStyle}
                cursor={{ fill: '#1e293b', opacity: 0.4 }}
              />
              <Bar dataKey="total" radius={[10, 10, 0, 0]}>
                {roles.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};
