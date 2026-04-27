"use client";

import { useState } from 'react';
import { UserTable } from './components/UserTable';
import { UserModal } from './components/UserModal';
import { Header } from '../components/Header';
import { User } from '@/lib/types';
import { motion } from 'motion/react';

export default function UsuariosPage() {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleSuccess = () => {
    setRefreshTrigger(t => t + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Header
        title="Lista de Usuarios"
        subtitle="Monitorea y gestiona los accesos de tu plataforma."
      />

      <UserTable
        onEdit={handleEditUser}
        onAdd={handleAddUser}
        refreshTrigger={refreshTrigger}
      />

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={selectedUser}
        onSuccess={handleSuccess}
      />
    </motion.div>
  );
}
