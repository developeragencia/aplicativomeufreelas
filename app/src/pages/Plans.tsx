import AppShell from '../components/AppShell';
import PaymentModal from '../components/PaymentModal';
import { useState } from 'react';

const plans = [
  { id: 'basic', name: 'Basic', price: '29,90' },
  { id: 'pro', name: 'Pro', price: '59,90' },
  { id: 'premium', name: 'Premium', price: '99,90' },
];

export default function Plans() {
  const [openPlan, setOpenPlan] = useState<null | { id: string; name: string; price: string }>(null);
  return (
    <AppShell wide>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Planos</h1>
        <p className="text-gray-600 mb-6">Escolha um plano para turbinar sua conta.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{p.name}</h3>
              <p className="text-99blue font-bold text-xl mb-4">R$ {p.price}/mês</p>
              <button
                type="button"
                onClick={() => setOpenPlan(p)}
                className="px-4 py-2 bg-99blue text-white rounded hover:bg-99blue-light"
              >
                Assinar
              </button>
            </div>
          ))}
        </div>
      </div>
      <PaymentModal
        isOpen={!!openPlan}
        onClose={() => setOpenPlan(null)}
        plan={openPlan || { id: '', name: '', price: '' }}
        onSuccess={() => {}}
      />
    </AppShell>
  );
}
