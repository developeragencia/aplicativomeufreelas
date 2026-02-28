import AppShell from '../components/AppShell';

export default function FreelancerDashboard() {
  return (
    <AppShell wide>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Painel do Freelancer</h1>
        <p className="text-gray-600 mb-6">Resumo dos seus projetos e atividades.</p>
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
