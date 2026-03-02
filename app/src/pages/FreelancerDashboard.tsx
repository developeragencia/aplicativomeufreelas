import AppShell from '../components/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiListProposals, apiListProjects } from '@/lib/api';
import { FileText, Briefcase, Award, TrendingUp } from 'lucide-react';

export default function FreelancerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    proposalsCount: 0,
    activeContracts: 0,
    completedProjects: 0
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
        // Load proposals count
        const propsRes = await apiListProposals({ freelancerId: user.id });
        const proposalsCount = propsRes.ok && propsRes.proposals ? propsRes.proposals.length : 0;

        // Load active contracts (projects where I am freelancer and status is In_Progress)
        const contractsRes = await apiListProjects({ freelancerId: user.id, status: 'In_Progress' });
        const activeContracts = contractsRes.ok && contractsRes.projects ? contractsRes.projects.length : 0;

        // Load completed projects
        const completedRes = await apiListProjects({ freelancerId: user.id, status: 'Closed' });
        const completedProjects = completedRes.ok && completedRes.projects ? completedRes.projects.length : 0;

        setStats({ proposalsCount, activeContracts, completedProjects });
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
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel do Freelancer</h1>
            <p className="text-gray-600">Bem-vindo de volta, {user.name}</p>
          </div>
          <Link to="/projects" className="bg-99blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Buscar Projetos
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Propostas Enviadas</p>
              <h3 className="text-2xl font-bold text-gray-900">{loading ? '-' : stats.proposalsCount}</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-99blue" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Contratos Ativos</p>
              <h3 className="text-2xl font-bold text-gray-900">{loading ? '-' : stats.activeContracts}</h3>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Projetos Concluídos</p>
              <h3 className="text-2xl font-bold text-gray-900">{loading ? '-' : stats.completedProjects}</h3>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-500" />
            Atividades Recentes
          </h2>
          <div className="text-center py-8 text-gray-500 text-sm">
            Nenhuma atividade recente para exibir.
          </div>
        </div>
      </div>
    </AppShell>
  );
}
