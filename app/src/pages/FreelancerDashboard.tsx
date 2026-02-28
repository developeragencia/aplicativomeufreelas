import AppShell from '../components/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function FreelancerDashboard() {
  const { user, createSecondaryAccount, switchAccountType } = useAuth();
  const [status, setStatus] = useState<{ ok?: string; err?: string }>({});
  const handleCreateClient = async () => {
    setStatus({});
    const ok = await createSecondaryAccount('client');
    setStatus(ok ? { ok: 'Conta cliente criada.' } : { err: 'Não foi possível criar a conta.' });
  };
  const handleSwitchToClient = async () => {
    setStatus({});
    const ok = await switchAccountType();
    setStatus(ok ? { ok: 'Alternado para cliente.' } : { err: 'Não foi possível alternar.' });
  };
  return (
    <AppShell wide>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Painel do Freelancer</h1>
        <p className="text-gray-600 mb-6">Resumo dos seus projetos e atividades.</p>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Status de contas</p>
              <p className="text-xs text-gray-500">Freelancer ativo. {user?.hasClientAccount ? 'Conta cliente disponível.' : 'Sem conta cliente.'}</p>
            </div>
            <div className="flex gap-2">
              {!user?.hasClientAccount ? (
                <button onClick={handleCreateClient} className="px-4 py-2 text-sm rounded bg-99blue text-white hover:bg-sky-500">
                  Criar conta cliente
                </button>
              ) : (
                <button onClick={handleSwitchToClient} className="px-4 py-2 text-sm rounded border border-99blue text-99blue hover:bg-sky-50">
                  Alternar para cliente
                </button>
              )}
            </div>
          </div>
          {status.ok && <div className="mt-3 text-sm text-green-600">{status.ok}</div>}
          {status.err && <div className="mt-3 text-sm text-red-600">{status.err}</div>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Propostas</h2>
            <p className="text-sm text-gray-500">0 enviadas</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Contratos</h2>
            <p className="text-sm text-gray-500">0 ativos</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Ranking</h2>
            <p className="text-sm text-gray-500">Em breve</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
