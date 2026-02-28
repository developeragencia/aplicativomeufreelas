import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../contexts/AuthContext';
import { setSEO } from '../lib/seo';

type ProposalItem = {
  id: string;
  projectId: string;
  projectTitle: string;
  value: string;
  deliveryDays: string;
  status: 'Pendente' | 'Aceita' | 'Recusada';
  createdAt: string;
};

function parseLocal(): ProposalItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem('meufreelas_proposals') || '[]');
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((p: any) => ({
      id: String(p.id || Date.now()),
      projectId: String(p.projectId || ''),
      projectTitle: String(p.projectTitle || 'Projeto'),
      value: String(p.value || '—'),
      deliveryDays: String(p.deliveryDays || '—'),
      status: (p.status as ProposalItem['status']) || 'Pendente',
      createdAt: String(p.createdAt || new Date().toISOString()),
    }));
  } catch {
    return [];
  }
}

export default function MyProposals() {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<ProposalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'Todas' | 'Pendente' | 'Aceita' | 'Recusada'>('Todas');

  useEffect(() => {
    setSEO({ title: 'Minhas Propostas - MeuFreelas', description: 'Acompanhe suas propostas enviadas.', canonicalPath: '/my-proposals' });
    setLoading(true);
    const list = parseLocal().filter((p) => !!p.projectId);
    setItems(list);
    setLoading(false);
  }, []);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.type !== 'freelancer' && !user?.hasFreelancerAccount) return <Navigate to="/project/new" replace />;

  const sorted = useMemo(() => items.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [items]);
  const filtered = useMemo(() => (statusFilter === 'Todas' ? sorted : sorted.filter((p) => p.status === statusFilter)), [sorted, statusFilter]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => { setCurrentPage(1); }, [statusFilter, items.length]);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  function statusColor(s: ProposalItem['status']) {
    if (s === 'Aceita') return 'text-green-600';
    if (s === 'Recusada') return 'text-red-600';
    return 'text-gray-600';
  }

  return (
    <AppShell wide>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-light text-gray-800">Minhas Propostas</h1>
            <p className="text-sm text-gray-600 mt-1">{filtered.length} proposta{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/projects" className="text-99blue hover:underline">Buscar projetos</Link>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2">Filtrar por status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="w-full sm:w-64 border border-gray-300 px-3 py-2 text-sm">
            <option value="Todas">Todas</option>
            <option value="Pendente">Pendente</option>
            <option value="Aceita">Aceita</option>
            <option value="Recusada">Recusada</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 w-1/3 mb-2" />
                <div className="h-3 bg-gray-200 w-2/3 mb-2" />
                <div className="h-3 bg-gray-200 w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="Você ainda não enviou propostas" description="Encontre um projeto e envie sua proposta." ctaHref="/projects" ctaLabel="Ver projetos" />
        ) : (
          <div className="space-y-4">
            {paginated.map((p) => (
              <article key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Link to={`/project/${p.projectId}`} className="block text-lg md:text-xl font-semibold text-99blue hover:underline mb-1 leading-snug">
                      {p.projectTitle}
                    </Link>
                    <p className="text-sm text-gray-600">Oferta: <strong>{p.value}</strong> • Entrega: <strong>{p.deliveryDays}</strong></p>
                  </div>
                  <div className={`text-sm font-medium ${statusColor(p.status)}`}>{p.status}</div>
                </div>
              </article>
            ))}
            <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setCurrentPage} className="flex justify-center mt-4 gap-2" ariaLabel="Paginação de Minhas Propostas" />
          </div>
        )}
      </div>
    </AppShell>
  );
}
