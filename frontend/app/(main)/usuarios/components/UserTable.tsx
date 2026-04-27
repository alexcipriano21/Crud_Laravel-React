"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchApi } from '@/lib/api';

interface UserTableProps {
  onEdit: (user: User) => void;
  onAdd: () => void;
  refreshTrigger?: number;
}

const SkeletonRow = () => (
  <TableRow className="border-slate-800/50">
    {[...Array(11)].map((_, i) => (
      <TableCell key={i}>
        <div className="h-4 rounded bg-slate-800 animate-pulse w-full" />
      </TableCell>
    ))}
  </TableRow>
);

export const UserTable = ({ onEdit, onAdd, refreshTrigger }: UserTableProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi('/usuarios');
      setUsers(data);
    } catch (e: any) {
      setError(e.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, refreshTrigger]);

  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const confirmDelete = (user: User) => {
    setUserToDelete(user);
  };

  const executeDelete = async () => {
    if (!userToDelete) return;
    setDeletingId(userToDelete.id);
    try {
      await fetchApi(`/usuarios/${userToDelete.id}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null);
    } catch (e: any) {
      alert(e.message || 'Error al eliminar usuario');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bento-surface overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-medium text-white tracking-tight">Personal del Sistema</h3>
          <p className="text-sm text-slate-500">Gestiona los accesos y roles de tu equipo.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <Input
              type="text"
              placeholder="Buscar..."
              className="pl-10 w-full sm:w-64 bento-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={onAdd}
            className="w-full sm:w-auto flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
          >
            <Plus size={18} />
            Crear Usuario
          </Button>
        </div>
      </div>

      {error && (
        <div className="m-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">ID</TableHead>
              <TableHead className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Imagen</TableHead>
              <TableHead className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Nombre</TableHead>
              <TableHead className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Correo Electrónico</TableHead>
              <TableHead className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Teléfono</TableHead>
              <TableHead className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Dirección</TableHead>
              <TableHead className="text-slate-500 text-[10px] uppercase tracking-widest font-bold text-center">Rol</TableHead>
              <TableHead className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Estado</TableHead>
              <TableHead className="text-slate-500 text-[10px] uppercase tracking-widest font-bold text-center">Verificado</TableHead>
              <TableHead className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Fecha de Registro</TableHead>
              <TableHead className="text-slate-500 text-[10px] uppercase tracking-widest font-bold text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center text-slate-500 py-12">
                  {searchTerm ? 'No se encontraron usuarios con ese criterio.' : 'No hay usuarios registrados.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user, idx) => (
                <motion.tr
                  key={user.id}
                  className="group border-b border-slate-800/50 hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <TableCell className="font-mono text-xs text-slate-500">
                    #{String(user.id).padStart(3, '0')}
                  </TableCell>
                  <TableCell>
                    <img
                      src={user.imagen || `https://picsum.photos/seed/${user.id}/200`}
                      alt={user.nombre}
                      className="w-8 h-8 rounded-lg bg-slate-700 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-white text-sm whitespace-nowrap">{user.nombre}</TableCell>
                  <TableCell className="text-xs text-slate-400">{user.email}</TableCell>
                  <TableCell className="text-xs text-slate-400">{user.telefono || '—'}</TableCell>
                  <TableCell className="text-xs text-slate-400 max-w-[140px] truncate">{user.direccion || '—'}</TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                      user.rol === 'administrador' ? "bg-indigo-500/10 text-indigo-400" :
                        user.rol === 'editor' ? "bg-purple-500/10 text-purple-400" :
                          user.rol === 'supervisor' ? "bg-pink-500/10 text-pink-400" :
                            "bg-slate-500/10 text-slate-400"
                    )}>
                      {user.rol}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-xs text-slate-300">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        user.estado === 'activo' ? "bg-emerald-500" :
                          user.estado === 'pendiente' ? "bg-amber-500" :
                            "bg-rose-500"
                      )} />
                      <span className="capitalize">{user.estado}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {user.check_verificado
                      ? <CheckCircle2 size={16} className="text-emerald-500 mx-auto" />
                      : <XCircle size={16} className="text-slate-600 mx-auto" />
                    }
                  </TableCell>
                  <TableCell className="text-xs text-slate-400 whitespace-nowrap">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => confirmDelete(user)}
                        disabled={deletingId === user.id}
                        className="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-400 transition-colors disabled:opacity-50"
                      >
                        {deletingId === user.id
                          ? <Loader2 size={14} className="animate-spin" />
                          : <Trash2 size={14} />
                        }
                      </button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmModal
        user={userToDelete}
        deleting={deletingId !== null}
        onConfirm={executeDelete}
        onCancel={() => setUserToDelete(null)}
      />
    </div>
  );
};

