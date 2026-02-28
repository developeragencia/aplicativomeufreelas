import AppShell from '../components/AppShell';

export default function Medals() {
  return (
    <AppShell wide>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Medalhas</h1>
        <p className="text-gray-600 mb-6">Conquistas por critérios de qualidade.</p>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Em breve: processamento e exibição de medalhas.</p>
        </div>
      </div>
    </AppShell>
  );
}
