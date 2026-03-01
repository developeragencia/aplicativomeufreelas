import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { apiApproveProject, apiKycStatus, apiRejectProject, apiListProjects } from '@/lib/api';

export default function AdminModeration() {
  const [loading, setLoading] = useState(false);
  const [pendingProjects, setPendingProjects] = useState<Array<{ id: string; title: string; clientName: string; createdAt: string }>>([]);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await apiListProjects({ status: 'Awaiting_Approval' });
      if (res.ok && res.projects) {
        setPendingProjects(
          res.projects.map((p: any) => ({
            id: String(p.id),
            title: String((p as any).title || (p as any).titulo || ''),
            clientName: String((p as any).clientName || (p as any).client_name || ''),
            createdAt: String((p as any).createdAt || (p as any).created_at || ''),
          }))
        );
      } else {
        setPendingProjects([]);
      }
      setLoading(false);
    }
    void load();
  }, []);

  const approve = async (id: string) => {
    await apiApproveProject(id);
    setPendingProjects((list) => list.filter((p) => p.id !== id));
  };
  const reject = async () => {
    if (!rejecting) return;
    await apiRejectProject(rejecting, reason);
    setPendingProjects((list) => list.filter((p) => p.id !== rejecting));
    setRejecting(null);
    setReason('');
  };

  return (
    <AppShell wide>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Moderação</h1>
        <p className="text-gray-600 mb-6">Aprovação e reprovação de projetos e perfis.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Projetos pendentes</h2>
            {loading ? (
              <p className="text-sm text-gray-500">Carregando...</p>
            ) : pendingProjects.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum projeto aguardando aprovação.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {pendingProjects.map((p) => (
                  <li key={p.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{p.title || `Projeto #${p.id}`}</p>
                      <p className="text-xs text-gray-500">Cliente: {p.clientName || '—'} · {new Date(p.createdAt).toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => approve(p.id)} className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700">Aprovar</button>
                      <button onClick={() => setRejecting(p.id)} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700">Reprovar</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Perfis pendentes</h2>
            <p className="text-sm text-gray-500">Lista de perfis aguardando moderação.</p>
          </section>
        </div>
        {rejecting && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded shadow p-5 w-full max-w-md">
              <h3 className="text-gray-800 font-semibold mb-2">Reprovar projeto #{rejecting}</h3>
              <label className="block text-sm text-gray-600 mb-2">Motivo (opcional)</label>
              <input value={reason} onChange={(e) => setReason(e.target.value)} className="w-full border border-gray-300 px-3 py-2 text-sm mb-4" placeholder="Descreva o motivo" />
              <div className="flex justify-end gap-2">
                <button onClick={() => setRejecting(null)} className="px-4 py-2 border border-gray-300 text-sm">Cancelar</button>
                <button onClick={reject} className="px-4 py-2 bg-red-600 text-white text-sm">Confirmar reprovação</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
