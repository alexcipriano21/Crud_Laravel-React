import { Sidebar } from '@/app/(main)/components/Sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0a0c14] text-slate-300 overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 h-screen overflow-y-auto">
        {children}
        <footer className="mt-12 text-center text-slate-400 text-xs py-8 border-t border-slate-200/50">
          <p>© 2026 Nexus Admin System • Todos los derechos reservados</p>
        </footer>
      </main>
    </div>
  );
}
