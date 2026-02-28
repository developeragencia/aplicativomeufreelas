import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo';

type AppShellProps = {
  children: ReactNode;
  wide?: boolean;
  noMainPadding?: boolean;
};

export default function AppShell({ children, wide = false, noMainPadding = false }: AppShellProps) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-99dark text-white">
        <div className={`mx-auto ${wide ? 'max-w-7xl' : 'max-w-6xl'} px-4 h-14 md:h-16 flex items-center justify-between`}>
          <BrandLogo to="/" heightClassName="h-9" darkBg />
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className={`${pathname === '/' ? 'text-white' : 'text-white/80'} hover:text-white`}>Página inicial</Link>
            <Link to="/projects" className={`${pathname.startsWith('/projects') ? 'text-white' : 'text-white/80'} hover:text-white`}>Projetos</Link>
            <Link to="/freelancers" className={`${pathname.startsWith('/freelancers') ? 'text-white' : 'text-white/80'} hover:text-white`}>Freelancers</Link>
            <Link to="/ajuda" className={`${pathname.startsWith('/ajuda') ? 'text-white' : 'text-white/80'} hover:text-white`}>Ajuda</Link>
            <Link to="/my-projects" className={`${pathname.startsWith('/my-projects') ? 'text-white' : 'text-white/80'} hover:text-white`}>Meus Projetos</Link>
            <Link to="/my-proposals" className={`${pathname.startsWith('/my-proposals') ? 'text-white' : 'text-white/80'} hover:text-white`}>Minhas Propostas</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/project/new" className="hidden sm:inline-flex px-4 py-2 bg-99blue rounded-lg hover:bg-sky-400">Publicar Projeto</Link>
            <Link to="/login" className="px-4 py-2 border border-white/40 rounded-lg text-white hover:bg-white/10">Entrar</Link>
          </div>
        </div>
      </header>
      <main className={`${wide ? 'max-w-7xl' : 'max-w-6xl'} mx-auto ${noMainPadding ? 'p-0' : 'px-4 py-8'}`}>
        {children}
      </main>
      <footer className="mt-8 border-t">
        <div className={`${wide ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-4 py-8 text-sm text-gray-600`}>
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div>© {new Date().getFullYear()} MeuFreelas</div>
            <div className="flex items-center gap-4">
              <Link to="/privacy">Privacidade</Link>
              <Link to="/terms">Termos</Link>
              <Link to="/status">Status</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
