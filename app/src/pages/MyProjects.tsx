import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../contexts/AuthContext';
import { setSEO } from '../lib/seo';
import { apiDeleteProject, hasApi, type ApiProject } from '../lib/api';

type ClientProject = {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: string;
  experienceLevel: string;
  proposals: number;
  createdAt: string;
};

function mapProject(p: any): ClientProject {
  const level = String(p.experienceLevel || p.nivel || 'intermediate');
  return {
    id: String(p.id),
    title: String(p.title || p.titulo || ''),
    description: String(p.description || p.descricao || ''),
    category: String(p.category || p.categoria || ''),
    budget: String(p.budget || 'Aberto'),
    experienceLevel: level,
    proposals: Number(p.proposals || 0),
    createdAt: String(p.createdAt || p.created_at || new Date().toISOString()),
  };
}

function parseLocal(): any[] {
  try {
    const raw = JSON.parse(localStorage.getItem('meufreelas_projects') || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export default function MyProjects() {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<string>('');

  useEffect(() => {
    setSEO({ title: 'Meus Projetos - MeuFreelas', description: 'Gerencie seus projetos publicados.', canonicalPath: '/my-projects' });
    async function load() {
      setLoading(true);
      setErrorMsg('');
      let list: ClientProject[] = [];
      const local = parseLocal().filter((p) => String(p.clientId || user?.id || '') === String(user?.id || ''));
      list = local.map(mapProject);
      setItems(list);
      setLoading(false);
    }
    load();
  }, [user?.id]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.type !== 'client' && !user?.hasClientAccount) return <Navigate to="/freelancer/dashboard" replace />;

  const sorted = useMemo(() => items.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [items]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage]);

  async function removeProject(id: string) {
    try {
      if (hasApi()) {
        const res = await apiDeleteProject(id, user!.id);
        if (!res.ok) setErrorMsg(res.error || '');
      }
    } catch {}
    const local = parseLocal().filter((p) => String(p.id) !== String(id));
    localStorage.setItem('meufreelas_projects', JSON.stringify(local));
    setItems(local.map(mapProject));
    setConfirmId(null);
    setToast('Projeto excluído com sucesso.');
    setTimeout(() => setToast(''), 2000);
  }

  return (
    <AppShell wide>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-light text-gray-800">Meus Projetos</h1>
            <p className="text-sm text-gray-600 mt-1">{sorted.length} projeto{sorted.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/project/new" className="bg-99blue hover:bg-99blue-dark text-white font-semibold py-2 px-4 rounded">Publicar novo</Link>
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
        ) : sorted.length === 0 ? (
          <EmptyState title="Você ainda não publicou projetos" description="Publique um projeto e receba propostas." ctaHref="/project/new" ctaLabel="Publicar projeto" />
        ) : (
          <div className="space-y-4">
            {paginated.map((p) => (
              <article key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Link to={`/project/${p.id}`} className="block text-lg md:text-xl font-semibold text-99blue hover:underline mb-1 leading-snug">
                      {p.title}
                    </Link>
                    <div className="text-xs text-gray-500 mb-2 flex flex-wrap gap-x-3 gap-y-1">
                      <span>{p.category}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full self-center"></span>
                      <span>{p.experienceLevel}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full self-center"></span>
                      <span>Propostas: <strong>{p.proposals}</strong></span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{p.description || 'Sem descrição.'}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link to={`/project/${p.id}`} className="text-99blue hover:underline text-sm">Ver detalhes</Link>
                    <button type="button" onClick={() => setConfirmId(p.id)} className="text-red-600 hover:underline text-sm">Excluir</button>
                  </div>
                </div>
              </article>
            ))}
            <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setCurrentPage} className="flex justify-center mt-4 gap-2" ariaLabel="Paginação de Meus Projetos" />
          </div>
        )}
        {errorMsg && <div className="mt-4 text-center text-sm text-red-600">{errorMsg}</div>}
        <Toast open={!!toast} message={toast} variant="success" />
        <ConfirmModal
          open={!!confirmId}
          title="Confirmar exclusão"
          message="Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={() => removeProject(confirmId!)}
          onCancel={() => setConfirmId(null)}
        />
      </div>
    </AppShell>
  );
}
