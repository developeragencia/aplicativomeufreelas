import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User as UserIcon, LayoutDashboard, Bell, MessageSquare, Search as SearchIcon, ChevronDown, Zap, Wallet } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from 'react';
import { api, hasApi } from '@/lib/api';

type AppShellProps = {
  children: ReactNode;
  wide?: boolean;
  noMainPadding?: boolean;
};

export default function AppShell({ children, wide = false, noMainPadding = false }: AppShellProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchType, setSearchType] = useState<'projects' | 'freelancers'>('projects');
  const [keyword, setKeyword] = useState('');
  const [notifCount, setNotifCount] = useState(0);
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; description?: string; link?: string; type: string; date?: string; isRead?: boolean }>>([]);
  const [connBalance, setConnBalance] = useState<number | null>(null);
  const [msgCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    let mounted = true;
    async function loadBadges() {
      try {
        if (!isAuthenticated || !user) return;
        if (hasApi()) {
          // Notifications (silent failure)
          try {
            const res = await api.post('/notifications.php', { action: 'list_notifications', userId: user.id } as any);
            const list = Array.isArray(res.data?.notifications) ? res.data.notifications : [];
            if (mounted) {
              setNotifications(list.slice(0, 6));
              setNotifCount(list.filter((n: any) => !n.isRead).length);
            }
          } catch {}
          // Connections balance (silent failure)
          try {
            const res = await api.get('/connections/');
            if (mounted) setConnBalance(typeof res.data?.balance === 'number' ? res.data.balance : null);
          } catch {}
        }
      } catch {}
    }
    loadBadges();
    return () => { mounted = false; };
  }, [isAuthenticated, user]);

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = keyword.trim();
    if (!q) return;
    if (searchType === 'projects') navigate(`/projects?search=${encodeURIComponent(q)}`);
    else navigate(`/freelancers?q=${encodeURIComponent(q)}`);
  };

  const userLabel = useMemo(() => {
    if (!user) return '';
    if (user.type === 'freelancer') return `${user.name} (Freelancer)`;
    if (user.type === 'client') return `${user.name} (Cliente)`;
    if (user.type === 'admin') return `${user.name} (Admin)`;
    return user.name;
  }, [user]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-99dark text-white shadow-sm sticky top-0 z-50">
        <div className={`mx-auto ${wide ? 'max-w-7xl' : 'max-w-6xl'} px-4 h-16 flex items-center justify-between`}>
          <div className="flex items-center gap-6 w-full">
            <BrandLogo to="/" heightClassName="h-8" darkBg />
            <form onSubmit={onSubmitSearch} className="hidden md:flex items-center gap-2 flex-1 max-w-2xl">
              <div className="relative">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as 'projects' | 'freelancers')}
                  className="h-9 rounded-l-md bg-white/10 text-white border border-white/20 px-2 text-sm focus:outline-none"
                >
                  <option value="projects">Projetos</option>
                  <option value="freelancers">Freelancers</option>
                </select>
              </div>
              <div className="relative flex-1">
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Buscar…"
                  className="w-full h-9 rounded-r-md bg-white/10 text-white placeholder-white/70 border border-white/20 px-3 pr-9 text-sm focus:outline-none"
                />
                <button type="submit" className="absolute right-1 top-1 rounded h-7 w-7 flex items-center justify-center hover:bg-white/10">
                  <SearchIcon className="w-4 h-4 text-white/90" />
                </button>
              </div>
            </form>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <Link to="/project/new" className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-99blue rounded-md hover:bg-blue-700 transition-colors">
                  Publicar Projeto
                </Link>
                <Link to="/messages" title="Mensagens" className="relative p-2 rounded hover:bg-white/10">
                  <MessageSquare className="w-5 h-5" />
                  {msgCount > 0 && <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1">{msgCount}</span>}
                </Link>
                <DropdownMenu onOpenChange={async (open) => {
                  if (open && hasApi() && user) {
                    try {
                      await api.post('/notifications.php', { action: 'mark_all_read', userId: user.id } as any);
                      setNotifCount(0);
                    } catch {}
                  }
                }}>
                  <DropdownMenuTrigger className="relative p-2 rounded hover:bg-white/10">
                    <Bell className="w-5 h-5" />
                    {notifCount > 0 && <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1">{notifCount}</span>}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="text-xs text-gray-500">Notificações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length === 0 ? (
                      <div className="px-3 py-6 text-sm text-gray-500">Nenhuma notificação recente.</div>
                    ) : (
                      notifications.map((n) => (
                        <DropdownMenuItem key={n.id} asChild>
                          <Link to={n.link || '/notifications'} className="flex flex-col gap-0.5">
                            <span className="text-sm text-gray-900">{n.title}</span>
                            {n.description && <span className="text-xs text-gray-500">{n.description}</span>}
                          </Link>
                        </DropdownMenuItem>
                      ))
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/notifications" className="text-center w-full">Ver todas</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link to="/connections" title="Conexões" className="relative p-2 rounded hover:bg-white/10 flex items-center gap-1">
                  <Wallet className="w-5 h-5" />
                  {typeof connBalance === 'number' && <span className="text-xs bg-emerald-600/90 rounded px-1">{connBalance}</span>}
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9 border border-gray-600">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-99blue text-white">{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userLabel}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={user.type === 'freelancer' ? '/freelancer/dashboard' : '/dashboard'} className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Painel</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Meu Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile/edit" className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Editar Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/medals" className="cursor-pointer">
                        <Zap className="mr-2 h-4 w-4" />
                        <span>Medalhas</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Entrar</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-99blue rounded-md hover:bg-blue-700 transition-colors">Cadastre-se</Link>
              </div>
            )}
          </div>
        </div>
        <div className="bg-99blue/90 border-t border-white/10">
          <div className={`mx-auto ${wide ? 'max-w-7xl' : 'max-w-6xl'} px-4 h-10 hidden md:flex items-center gap-6 text-sm`}>
            <Link to="/" className="text-white/90 hover:text-white">Página inicial</Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-white/90 hover:text-white flex items-center gap-1">
                Projetos <ChevronDown className="w-3.5 h-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild><Link to="/projects">Buscar projetos</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/my-projects">Meus projetos</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/my-proposals">Minhas propostas</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/favorites">Projetos salvos</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/freelancers" className="text-white/90 hover:text-white">Freelancers</Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-white/90 hover:text-white flex items-center gap-1">
                Perfil <ChevronDown className="w-3.5 h-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild><Link to="/profile">Meu perfil</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/profile/edit">Editar perfil</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/verified-identity">Validação de identidade</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/medals">Medalhas</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/connections">Histórico de conexões</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-white/90 hover:text-white flex items-center gap-1">
                Conta <ChevronDown className="w-3.5 h-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild><Link to="/payments">Pagamentos</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/notifications">Notificações</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/settings">Configurações de acesso</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/plans">Minhas assinaturas</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-white/90 hover:text-white flex items-center gap-1">
                Ferramentas <ChevronDown className="w-3.5 h-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild><Link to="/tools">Calculadora & Formatador</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-white/90 hover:text-white flex items-center gap-1">
                Ajuda <ChevronDown className="w-3.5 h-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild><Link to="/help">Central de ajuda</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/how-it-works">Como funciona</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className={`flex-1 ${wide ? 'max-w-7xl' : 'max-w-6xl'} w-full mx-auto ${noMainPadding ? 'p-0' : 'px-4 py-8'}`}>
        {children}
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
        <div className={`${wide ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-4 py-8 text-sm text-gray-600`}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>© {new Date().getFullYear()} MeuFreelas. Todos os direitos reservados.</div>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-99blue transition-colors">Privacidade</Link>
              <Link to="/terms" className="hover:text-99blue transition-colors">Termos</Link>
              <Link to="/help" className="hover:text-99blue transition-colors">Ajuda</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
