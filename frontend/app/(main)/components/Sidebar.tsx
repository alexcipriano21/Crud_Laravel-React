'use client';

import { motion } from 'motion/react';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCurrentUser } from '@/lib/hooks';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'users', label: 'Lista de Usuarios', icon: Users, href: '/usuarios' },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useCurrentUser();

  const isCollapsed = false; // mantenemos expandido por defecto

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const userName = user?.nombre ?? 'Super Admin';
  const userRole = user?.rol ? user.rol.charAt(0).toUpperCase() + user.rol.slice(1) : 'Administrador';
  const userImage = user?.imagen ?? '';
  const userId = user?.id ?? null;

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="h-screen bg-[#0d111d] border-r border-slate-800 text-slate-300 p-4 flex flex-col relative transition-all duration-300 z-50 overflow-hidden shrink-0"
    >
      <div className="p-4 mb-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
          C
        </div>
        <span className="text-xl font-semibold tracking-tight text-white whitespace-nowrap">
          CrudLaravel
        </span>
      </div>

      <nav className="flex-1 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                isActive
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'hover:bg-white/5 text-slate-400 hover:text-white'
              )}
            >
              <Icon size={20} className={cn(isActive && 'text-indigo-400')} />
              <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-800 pt-4">
        <div className="bg-white/5 rounded-2xl border border-white/10 p-3">
          <div className="flex items-center gap-3">
            <Link href="/perfil" className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 shrink-0 flex items-center justify-center text-indigo-400 overflow-hidden">
                <img
                  src={userImage || `https://picsum.photos/seed/${userId}/200`}
                  alt={userName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-white truncate">{userName}</p>
                <p className="text-xs text-slate-500">{userRole}</p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};
