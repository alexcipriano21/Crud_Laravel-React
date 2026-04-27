"use client";

import { ProfileSettings } from './components/ProfileSettings';
import { Header } from '../components/Header';
import { motion } from 'motion/react';

export default function PerfilPage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Header 
        title="Mi Perfil" 
        subtitle="Administra tu información personal y credenciales de acceso." 
      />
      
      <ProfileSettings />
    </motion.div>
  );
}
