"use client";

import { StatCards } from './components/StatCards';
import { MainCharts } from './components/MainCharts';
import { Header } from '../components/Header';
import { motion } from 'motion/react';

export default function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Header 
        title="Panel de Control" 
        subtitle="Monitorea y gestiona tu plataforma Nexus." 
      />
      <StatCards />
      <MainCharts />
    </motion.div>
  );
}
