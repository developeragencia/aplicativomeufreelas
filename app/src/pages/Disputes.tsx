import AppShell from '../components/AppShell';

export default function Disputes() {
  return (
    <AppShell wide>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Disputas</h1>
        <p className="text-gray-600 mb-6">Acompanhe e abra disputas de projetos.</p>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Minhas disputas</h2>
          <p className="text-sm text-gray-500">Nenhuma disputa aberta.</p>
        </div>
      </div>
    </AppShell>
  );
}
