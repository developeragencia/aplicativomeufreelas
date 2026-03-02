import AppShell from '../components/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiListNotifications, apiListProjects, apiListProposals } from '@/lib/api';
import { 
  Plus, LayoutGrid, FileText, CreditCard, Users, 
  ArrowRight, Bell, MessageSquare 
} from 'lucide-react';

export default function ClientDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeProjects: 0,
    proposalsReceived: 0,
    invitationsSent: 0
  });
  const [events, setEvents] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    async function loadData() {
      if (!user?.id) return;
      setLoading(true);
      
      try {
        // Load Notifications for Feed
        const resNotif = await apiListNotifications(String(user.id));
        if (resNotif.ok && resNotif.notifications) {
          const list = (resNotif.notifications as any[]).filter((n) => n.type === 'project').slice(0, 5);
          setEvents(list);
        }

        // Load Stats
        const resProj = await apiListProjects({ clientId: user.id });
        const activeProjects = resProj.ok && resProj.projects 
          ? resProj.projects.filter((p: any) => p.status === 'In_Progress' || p.status === 'Aberto').length 
          : 0;

        const resProp = await apiListProposals({ clientId: user.id });
        const proposalsReceived = resProp.ok && resProp.proposals 
          ? resProp.proposals.filter(p => p.status === 'Pendente').length 
          : 0;

        setStats({
          activeProjects,
          proposalsReceived,
          invitationsSent: 0
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, [user?.id, isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <AppShell wide>
      <div className="bg-gray-50 min-h-screen pb-12">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Painel do Cliente</h1>
                <p className="text-gray-500 mt-1">
                  Gerencie seus projetos e contratações em um só lugar.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/freelancers" className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm shadow-sm">
                  Buscar Profissionais
                </Link>
                <Link to="/project/new" className="px-5 py-2.5 bg-99blue text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-sm shadow-blue-200 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Publicar Projeto
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatsCard 
              title="Projetos Ativos" 
              value={stats.activeProjects} 
              icon={LayoutGrid} 
              color="blue" 
              loading={loading}
              link="/my-projects"
            />
            <StatsCard 
              title="Novas Propostas" 
              value={stats.proposalsReceived} 
              icon={FileText} 
              color="emerald" 
              loading={loading}
              link="/my-projects" // Ideally link to a proposals dashboard
            />
            <StatsCard 
              title="Convites Enviados" 
              value={stats.invitationsSent} 
              icon={Users} 
              color="purple" 
              loading={loading}
              link="/invitations"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-8">
              {/* Active Projects Teaser */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-gray-500" />
                    Seus Projetos Recentes
                  </h2>
                  <Link to="/my-projects" className="text-sm text-99blue font-medium hover:underline flex items-center gap-1">
                    Ver todos <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                
                {stats.activeProjects > 0 ? (
                  <div className="p-6">
                    <div className="text-center py-8">
                       <p className="text-gray-500">Você tem {stats.activeProjects} projetos em andamento.</p>
                       <Link to="/my-projects" className="text-99blue font-medium mt-2 inline-block">Gerenciar projetos</Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <LayoutGrid className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-gray-900 font-medium mb-2">Nenhum projeto ativo</h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                      Publique um projeto para começar a receber propostas de freelancers qualificados.
                    </p>
                    <Link to="/project/new" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors">
                      Publicar Projeto Agora
                    </Link>
                  </div>
                )}
              </div>

              {/* Notifications / Events */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                 <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-gray-500" />
                    Últimas Atualizações
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {events.length > 0 ? (
                    events.map((evt) => (
                      <div key={evt.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500">
                            <Bell className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{evt.title}</p>
                            <p className="text-sm text-gray-500 mt-1">{evt.description}</p>
                            {evt.link && (
                              <Link to={evt.link} className="text-xs text-99blue font-medium mt-2 inline-block hover:underline">
                                Ver detalhes
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500 text-sm">
                      Nenhuma notificação recente.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile/Balance Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-99blue text-white text-xl font-bold">
                          {user.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">Cliente</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Saldo Disponível</p>
                  <p className="text-2xl font-bold text-gray-900">R$ 0,00</p>
                </div>
                <Link to="/payments" className="block w-full py-2 text-center text-sm bg-99blue text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                  Adicionar Saldo
                </Link>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Gerenciamento</h3>
                <nav className="space-y-1">
                  <Link to="/payments" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    <CreditCard className="w-4 h-4" />
                    Pagamentos e Faturas
                  </Link>
                  <Link to="/settings" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    Configurações
                  </Link>
                  <Link to="/help" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    Central de Ajuda
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatsCard({ title, value, icon: Icon, color, loading, link }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  const Content = (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colors[color] || colors.blue}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{loading ? '-' : value}</h3>
        <p className="text-sm font-medium text-gray-500">{title}</p>
      </div>
    </div>
  );

  if (link) return <Link to={link} className="block h-full">{Content}</Link>;
  return Content;
}
