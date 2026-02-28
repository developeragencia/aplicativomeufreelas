import AppShell from '../components/AppShell';

export default function AdminModeration() {
  return (
    <AppShell wide>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Moderação</h1>
        <p className="text-gray-600 mb-6">Aprovação e reprovação de projetos e perfis.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Projetos pendentes</h2>
            <p className="text-sm text-gray-500">Lista de projetos aguardando moderação.</p>
          </section>
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Perfis pendentes</h2>
            <p className="text-sm text-gray-500">Lista de perfis aguardando moderação.</p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
