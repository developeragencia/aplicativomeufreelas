import { useEffect, useState } from 'react';
import { apiHealth, hasApi } from '../lib/api';
import { setSEO } from '../lib/seo';
import BrandLogo from '../components/BrandLogo';
import { Link } from 'react-router-dom';

export default function Status() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ ok: boolean; database?: string; env_ok?: boolean; missing?: string[]; usersCount?: number; error?: string; statusCode?: number; responseMs?: number }>({ ok: false });

  useEffect(() => {
    async function load() {
      setLoading(true);
      setSEO({ title: 'Status - MeuFreelas', description: 'Saúde da API e banco de dados.', canonicalPath: '/status' });
      if (hasApi()) {
        const res = await apiHealth();
        setData(res);
      } else {
        setData({ ok: true, database: 'dev', env_ok: true, usersCount: 0 });
      }
      setLoading(false);
    }
    load();
  }, []);

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
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-4">Status do Sistema</h1>
        {loading ? (
          <div className="border border-gray-300 p-8 text-center text-gray-500">Carregando status...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <div className="border border-gray-300 p-4">
              <div className="text-sm text-gray-600">API</div>
              <div className={`text-lg font-semibold ${data.ok ? 'text-green-600' : 'text-red-600'}`}>{data.ok ? 'OK' : 'Falha'}</div>
              {data.error && <div className="text-sm text-red-600 mt-2">{data.error}</div>}
              <div className="text-sm text-gray-600 mt-2">HTTP: {typeof data.statusCode === 'number' ? data.statusCode : '-'}</div>
              <div className="text-sm text-gray-600">Resposta: {typeof data.responseMs === 'number' ? `${data.responseMs} ms` : '-'}</div>
            </div>
            <div className="border border-gray-300 p-4">
              <div className="text-sm text-gray-600">Banco de dados</div>
              <div className="text-lg font-semibold">{data.database || 'desconhecido'}</div>
            </div>
            <div className="border border-gray-300 p-4">
              <div className="text-sm text-gray-600">Variáveis .env</div>
              <div className={`text-lg font-semibold ${data.env_ok ? 'text-green-600' : 'text-red-600'}`}>{data.env_ok ? 'OK' : 'Faltando'}</div>
              {!data.env_ok && data.missing && data.missing.length > 0 && (
                <div className="text-sm text-gray-600 mt-2">Ausentes: {data.missing.join(', ')}</div>
              )}
            </div>
            <div className="border border-gray-300 p-4">
              <div className="text-sm text-gray-600">Usuários</div>
              <div className="text-lg font-semibold">{typeof data.usersCount === 'number' ? data.usersCount : '-'}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
