export type UserRole = 'administrador' | 'colaborador' | 'editor' | 'supervisor';
export type UserStatus = 'activo' | 'inactivo' | 'pendiente';

export interface User {
  id: number;
  nombre: string;
  email: string;
  imagen?: string | null;
  rol: UserRole;
  estado: UserStatus;
  check_verificado: boolean;
  telefono?: string | null;
  direccion?: string | null;
  created_at?: string | null;
}
