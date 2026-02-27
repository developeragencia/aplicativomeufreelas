import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGetFreelancerById, hasApi } from '../lib/api';
import { setSEO } from '../lib/seo';
import BrandLogo from '../components/BrandLogo';

export default function UserProfile() {
  const { id = '' } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    document.title = 'Perfil - MeuFreelas';
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (hasApi()) {
          const res = await apiGetFreelancerById(id);
          if (res.ok && res.item) {
            setUser(res.item);
            const nameForTitle = String(res.item.name || res.item.username || 'Freelancer');
            setSEO({
              title: `${nameForTitle} - Perfil | MeuFreelas`,
              description: 'Veja habilidades, experiência e avaliações deste freelancer.',
              canonicalPath: `/user/${id}`
            });
          } else {
            setError(res.error || 'Perfil não encontrado');
          }
        } else {
          setError('API indisponível');
        }
      } catch {
        setError('Falha ao carregar perfil');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-99dark text-white">
        <div className="max-w-7xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <BrandLogo to="/" heightClassName="h-10" darkBg />
          <nav className="hidden md:flex items-center gap-5 text-sm">
            <Link to="/">Home</Link>
            <Link to="/projects">Projetos</Link>
            <Link to="/freelancers">Freelancers</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="border border-gray-300 p-8 text-center text-gray-500">Carregando perfil...</div>
        ) : error ? (
          <div className="border border-red-300 bg-red-50 p-6 text-center text-red-700">{error}</div>
        ) : !user ? (
          <div className="border border-gray-300 p-8 text-center text-gray-500">Perfil não encontrado.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
            <aside className="border border-gray-200 p-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border mx-auto md:mx-0 mb-4">
                <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username)}&background=003366&color=fff`} alt={user.name || user.username} className="w-full h-full object-cover" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 capitalize">{String(user.name || user.username).toLowerCase()}</h1>
              <p className="text-sm text-blue-600">{user.title || 'Freelancer'}</p>
              <div className="mt-4 text-sm text-gray-600">
                <div>Concluídos: <strong>{user.completedProjects || 0}</strong></div>
                <div>Avaliação: <strong>{typeof user.rating === 'number' ? user.rating.toFixed(1) : 0}</strong></div>
              </div>
              {Array.isArray(user.skills) && user.skills.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-sm font-semibold text-gray-900">Habilidades</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.skills.slice(0, 10).map((s: string) => (
                      <span key={s} className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </aside>
            <section className="border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Sobre</h2>
              <p className="text-gray-700 leading-relaxed">{user.bio || 'Sem descrição disponível.'}</p>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
