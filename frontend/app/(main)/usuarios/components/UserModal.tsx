"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Loader2 } from 'lucide-react';
import { User } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchApi } from '@/lib/api';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  onSuccess: () => void;
}

export const UserModal = ({ isOpen, onClose, user, onSuccess }: UserModalProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
    rol: 'colaborador',
    estado: 'pendiente',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        password: '',
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        rol: user.rol || 'colaborador',
        estado: user.estado || 'pendiente',
      });
    } else {
      setFormData({ nombre: '', email: '', password: '', telefono: '', direccion: '', rol: 'colaborador', estado: 'pendiente' });
    }
    setError(null);
  }, [user, isOpen]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (user) {
        await fetchApi(`/usuarios/${user.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            ...formData,
            check_verificado: user.check_verificado ?? false,
            imagen: user.imagen ?? null,
          }),
        });
      } else {
        await fetchApi('/usuarios', {
          method: 'POST',
          body: JSON.stringify({ ...formData, imagen: null }),
        });
      }
      onSuccess();
      onClose();
    } catch (e: any) {
      setError(e.message || 'Error al guardar usuario');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#0d111d] border border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl relative z-[110]"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h3>
              <p className="text-sm text-slate-500">Completa los datos para el acceso al sistema.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} className="text-slate-500 hover:text-white" />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nombre Completo *</Label>
                <Input
                  type="text"
                  value={formData.nombre}
                  onChange={e => handleChange('nombre', e.target.value)}
                  placeholder="Ej: Alexander Cipriano"
                  className="bento-input w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Correo Electrónico *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="nombre@empresa.com"
                  className="bento-input w-full"
                  required
                />
              </div>
              {!user && (
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Contraseña *</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={e => handleChange('password', e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="bento-input w-full"
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Teléfono</Label>
                <Input
                  type="text"
                  value={formData.telefono}
                  onChange={e => handleChange('telefono', e.target.value)}
                  placeholder="+1 000 000 0000"
                  className="bento-input w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Rol de Acceso *</Label>
                <Select value={formData.rol} onValueChange={v => handleChange('rol', v)}>
                  <SelectTrigger className="bento-input w-full">
                    <SelectValue placeholder="Seleccionar Rol" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-300 z-[200]">
                    <SelectItem value="colaborador">Colaborador</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Estado *</Label>
                <Select value={formData.estado} onValueChange={v => handleChange('estado', v)}>
                  <SelectTrigger className="bento-input w-full">
                    <SelectValue placeholder="Seleccionar Estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-300 z-[200]">
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Dirección Física</Label>
                <Input
                  type="text"
                  value={formData.direccion}
                  onChange={e => handleChange('direccion', e.target.value)}
                  placeholder="Calle, Número, Ciudad, CP"
                  className="bento-input w-full"
                />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 py-6 border-slate-800 bg-transparent hover:bg-white/5 hover:text-white text-slate-300"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-[2] py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-600/20"
              >
                {loading
                  ? <Loader2 size={18} className="animate-spin mr-2" />
                  : <Save size={18} className="mr-2" />
                }
                {user ? 'Guardar Cambios' : 'Registrar Usuario'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
