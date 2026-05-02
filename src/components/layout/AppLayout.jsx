import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <footer className="mt-16 border-t border-border/40 py-8 text-center text-muted-foreground text-sm">
        <p>© 2026 StreamX — Todos os direitos reservados</p>
      </footer>
    </div>
  );
}