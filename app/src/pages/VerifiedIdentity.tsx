import AppShell from '../components/AppShell';

export default function VerifiedIdentity() {
  return (
    <AppShell wide>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Identidade Verificada</h1>
        <p className="text-gray-600 mb-6">Envie seus documentos e verifique sua identidade.</p>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Fluxo em implementação.</p>
        </div>
      </div>
    </AppShell>
  );
}
