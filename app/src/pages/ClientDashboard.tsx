import AppShell from '../components/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiListNotifications, apiListProjects, apiListProposals } from '@/lib/api';

export default function ClientDashboard() {
  const { user, isAuthenticated, createSecondaryAccount, switchAccountType } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<{ ok?: string; err?: string }>({});
  const [events, setEvents] = useState<Array<{ id: string; title: string; description?: string; link?: string; date?: string }>>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [stats, setStats] = useState({
    activeProjects: 0,
    proposalsReceived: 0,
    invitationsSent: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;
      
      setLoadingEvents(true);
      
      // Load Notifications
      const resNotif = await apiListNotifications(String(user.id));
      if (resNotif.ok && resNotif.notifications) {
        const list = (resNotif.notifications as any[]).filter((n) => n.type === 'project').slice(0, 6);
        setEvents(list);
      } else {
        setEvents([]);
      }

      // Load Projects Stats
      const resProj = await apiListProjects({ clientId: user.id });
      const activeProjects = resProj.ok && resProj.projects 
        ? resProj.projects.filter((p: any) => p.status === 'In_Progress' || p.status === 'Aberto').length 
        : 0;

      // Load Proposals Stats
      const resProp = await apiListProposals({ clientId: user.id });
      const proposalsReceived = resProp.ok && resProp.proposals 
        ? resProp.proposals.filter(p => p.status === 'Pendente').length 
        : 0;

      setStats({
        activeProjects,
        proposalsReceived,
        invitationsSent: 0 // TODO: Implement invitations API
      });

      setLoadingEvents(false);
    }
    void loadData();
  }, [user?.id]);

  if (!user) return null;

  const handleCreateFreelancer = async () => {
    setStatus({});
    const ok = await createSecondaryAccount('freelancer');
    setStatus(ok ? { ok: 'Conta freelancer criada.' } : { err: 'Não foi possível criar a conta.' });
  };
  const handleSwitchToFreelancer = async () => {
    setStatus({});
    const ok = await switchAccountType();
    setStatus(ok ? { ok: 'Alternado para freelancer.' } : { err: 'Não foi possível alternar.' });
  };
  return (
    <AppShell wide>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Painel do Cliente</h1>
        <p className="text-gray-600 mb-6">Resumo dos seus projetos e atividades.</p>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Status de contas</p>
              <p className="text-xs text-gray-500">Cliente ativo. {user?.hasFreelancerAccount ? 'Conta freelancer disponível.' : 'Sem conta freelancer.'}</p>
            </div>
            <div className="flex gap-2">
              {!user?.hasFreelancerAccount ? (
                <button onClick={handleCreateFreelancer} className="px-4 py-2 text-sm rounded bg-99blue text-white hover:bg-sky-500">
                  Criar conta freelancer
                </button>
              ) : (
                <button onClick={handleSwitchToFreelancer} className="px-4 py-2 text-sm rounded border border-99blue text-99blue hover:bg-sky-50">
                  Alternar para freelancer
                </button>
              )}
            </div>
          </div>
          {status.ok && <div className="mt-3 text-sm text-green-600">{status.ok}</div>}
          {status.err && <div className="mt-3 text-sm text-red-600">{status.err}</div>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Projetos</h2>
            <p className="text-sm text-gray-500">{stats.activeProjects} ativos</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Propostas recebidas</h2>
            <p className="text-sm text-gray-500">{stats.proposalsReceived} novas</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Convites</h2>
            <p className="text-sm text-gray-500">{stats.invitationsSent} enviados</p>
          </div>
        </div>
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Eventos recentes do projeto</h2>
            <Link to="/notifications" className="text-sm text-99blue hover:underline">Ver todas</Link>
          </div>
          {loadingEvents ? (
            <p className="text-sm text-gray-500">Carregando…</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum evento recente.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {events.map((e) => (
                <li key={e.id} className="py-2 flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-800">{e.title}</p>
                    {e.description && <p className="text-xs text-gray-500">{e.description}</p>}
                  </div>
                  <div className="ml-4">
                    {e.link && <Link to={e.link} className="text-sm text-99blue hover:underline">Abrir</Link>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}
