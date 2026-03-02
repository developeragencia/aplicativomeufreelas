import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { 
  apiApproveProject, 
  apiRejectProject, 
  apiListProjects,
  apiGetPendingProfiles,
  apiApproveProfile,
  apiRejectProfile
} from '@/lib/api';

export default function AdminModeration() {
  const [loading, setLoading] = useState(false);
  const [pendingProjects, setPendingProjects] = useState<Array<{ id: string; title: string; clientName: string; createdAt: string }>>([]);
  const [pendingProfiles, setPendingProfiles] = useState<Array<{ id: string; name: string; type: string; createdAt: string }>>([]);
  
  const [rejectingProject, setRejectingProject] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [rejectingProfile, setRejectingProfile] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      
      // Load Projects
      const resProj = await apiListProjects({ status: 'Awaiting_Approval' });
      if (resProj.ok && resProj.projects) {
        setPendingProjects(
          resProj.projects.map((p: any) => ({
            id: String(p.id),
            title: String((p as any).title || (p as any).titulo || ''),
            clientName: String((p as any).clientName || (p as any).client_name || ''),
            createdAt: String((p as any).createdAt || (p as any).created_at || ''),
          }))
        );
      } else {
        setPendingProjects([]);
      }

      // Load Profiles
      const resProf = await apiGetPendingProfiles();
      if (resProf.ok && resProf.profiles) {
        setPendingProfiles(
            resProf.profiles.map((p: any) => ({
            id: String(p.id),
            name: String(p.name || p.email),
            type: String(p.type),
            createdAt: String(p.created_at || ''),
          }))
        );
      } else {
        setPendingProfiles([]);
      }

      setLoading(false);
    }
    void load();
  }, []);

  // Projects Actions
  const approveProj = async (id: string) => {
    await apiApproveProject(id);
    setPendingProjects((list) => list.filter((p) => p.id !== id));
  };
  const rejectProj = async () => {
    if (!rejectingProject) return;
    await apiRejectProject(rejectingProject, rejectReason);
    setPendingProjects((list) => list.filter((p) => p.id !== rejectingProject));
    setRejectingProject(null);
    setRejectReason('');
  };

  // Profiles Actions
  const approveProf = async (id: string) => {
    await apiApproveProfile(id);
    setPendingProfiles((list) => list.filter((p) => p.id !== id));
  };
  const rejectProf = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja reprovar (bloquear) este perfil?')) return;
    await apiRejectProfile(id);
    setPendingProfiles((list) => list.filter((p) => p.id !== id));
  };

  return (
    <AppShell wide>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Moderação</h1>
        <p className="text-gray-600 mb-6">Aprovação e reprovação de projetos e perfis.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projects Column */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Projetos pendentes</h2>
            {loading ? (
              <p className="text-sm text-gray-500">Carregando...</p>
            ) : pendingProjects.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center italic">Nenhum projeto aguardando aprovação.</p>
            ) : (
              <ul className="divide-y divide-gray-100 flex-1 overflow-auto max-h-[600px]">
                {pendingProjects.map((p) => (
                  <li key={p.id} className="py-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{p.title || `Projeto #${p.id}`}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Cliente: {p.clientName || '—'}</p>
                        <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1 self-end">
                      <button onClick={() => approveProj(p.id)} className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors">Aprovar</button>
                      <button onClick={() => setRejectingProject(p.id)} className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded hover:bg-red-700 transition-colors">Reprovar</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Profiles Column */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Perfis pendentes</h2>
            {loading ? (
              <p className="text-sm text-gray-500">Carregando...</p>
            ) : pendingProfiles.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center italic">Nenhum perfil aguardando moderação.</p>
            ) : (
              <ul className="divide-y divide-gray-100 flex-1 overflow-auto max-h-[600px]">
                {pendingProfiles.map((p) => (
                  <li key={p.id} className="py-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{p.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Tipo: {p.type}</p>
                        <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1 self-end">
                      <button onClick={() => approveProf(p.id)} className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors">Aprovar</button>
                      <button onClick={() => rejectProf(p.id)} className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded hover:bg-red-700 transition-colors">Reprovar</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {rejectingProject && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded shadow p-5 w-full max-w-md">
              <h3 className="text-gray-800 font-semibold mb-2">Reprovar projeto #{rejectingProject}</h3>
              <label className="block text-sm text-gray-600 mb-2">Motivo (opcional)</label>
              <input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="w-full border border-gray-300 px-3 py-2 text-sm mb-4 rounded" placeholder="Descreva o motivo" />
              <div className="flex justify-end gap-2">
                <button onClick={() => setRejectingProject(null)} className="px-4 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50">Cancelar</button>
                <button onClick={rejectProj} className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700">Confirmar reprovação</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
