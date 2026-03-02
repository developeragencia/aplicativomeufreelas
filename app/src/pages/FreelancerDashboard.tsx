import AppShell from '../components/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiListProposals, apiListProjects } from '@/lib/api';
import { 
  FileText, Briefcase, Award, TrendingUp, Search, 
  ArrowRight, DollarSign, Clock, CheckCircle2, User
} from 'lucide-react';

export default function FreelancerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    proposalsCount: 0,
    activeContracts: 0,
    completedProjects: 0,
    totalEarnings: 0 // Mock por enquanto
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    async function loadStats() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const propsRes = await apiListProposals({ freelancerId: user.id });
        const proposalsCount = propsRes.ok && propsRes.proposals ? propsRes.proposals.length : 0;

        const contractsRes = await apiListProjects({ freelancerId: user.id, status: 'In_Progress' });
        const activeContracts = contractsRes.ok && contractsRes.projects ? contractsRes.projects.length : 0;

        const completedRes = await apiListProjects({ freelancerId: user.id, status: 'Closed' });
        const completedProjects = completedRes.ok && completedRes.projects ? completedRes.projects.length : 0;

        setStats({ 
          proposalsCount, 
          activeContracts, 
          completedProjects,
          totalEarnings: completedProjects * 150 // Mock value
        });
      } catch (e) {
        console.error('Failed to load dashboard stats', e);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [isAuthenticated, user, navigate]);

  if (!user) return null;

  return (
    <AppShell wide>
      <div className="bg-gray-50 min-h-screen pb-12">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Painel do Freelancer</h1>
                <p className="text-gray-500 mt-1 flex items-center gap-2">
                  Bem-vindo de volta, <span className="font-medium text-gray-900">{user.name}</span>
                  {user.isPro && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">PRO</span>}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/profile" className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm shadow-sm">
                  Meu Perfil
                </Link>
                <Link to="/projects" className="px-5 py-2.5 bg-99blue text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-sm shadow-blue-200 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Buscar Projetos
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatsCard 
              title="Propostas Enviadas" 
              value={stats.proposalsCount} 
              icon={FileText} 
              color="blue" 
              loading={loading}
              link="/my-proposals"
            />
            <StatsCard 
              title="Contratos Ativos" 
              value={stats.activeContracts} 
              icon={Briefcase} 
              color="emerald" 
              loading={loading}
              link="/my-projects"
            />
            <StatsCard 
              title="Projetos Concluídos" 
              value={stats.completedProjects} 
              icon={CheckCircle2} 
              color="purple" 
              loading={loading}
            />
            <StatsCard 
              title="Ganhos Totais (Est.)" 
              value={`R$ ${stats.totalEarnings}`} 
              icon={DollarSign} 
              color="amber" 
              loading={loading}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recommended Projects Teaser */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gray-500" />
                    Recomendados para você
                  </h2>
                  <Link to="/projects" className="text-sm text-99blue font-medium hover:underline flex items-center gap-1">
                    Ver todos <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-gray-900 font-medium mb-2">Encontre seu próximo trabalho</h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                    Temos milhares de projetos esperando por suas habilidades. Comece a buscar agora mesmo.
                  </p>
                  <Link to="/projects" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors">
                    Explorar Oportunidades
                  </Link>
                </div>
              </div>

              {/* Recent Activity Placeholder */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-lg font-bold text-gray-900">Atividade Recente</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900 font-medium">Você visitou o painel.</p>
                        <p className="text-xs text-gray-500 mt-1">Hoje, às {new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
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
                    <p className="text-sm text-gray-500 truncate max-w-[150px]">{user.email}</p>
                    <Link to="/profile" className="text-xs text-99blue hover:underline mt-1 block">Ver perfil público</Link>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Plano Atual</span>
                    <span className="font-medium text-gray-900 capitalize">{user.plan || 'Gratuito'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Conexões</span>
                    <span className="font-medium text-gray-900">10 / 50</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-99blue h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <Link to="/plans" className="mt-6 block w-full py-2 text-center text-sm border border-99blue text-99blue font-medium rounded-lg hover:bg-blue-50 transition-colors">
                  Fazer Upgrade
                </Link>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Atalhos</h3>
                <nav className="space-y-1">
                  <Link to="/settings" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    Configurações da Conta
                  </Link>
                  <Link to="/verified-identity" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    Verificar Identidade
                  </Link>
                  <Link to="/medals" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                    Minhas Medalhas
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
    amber: 'bg-amber-50 text-amber-600'
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
