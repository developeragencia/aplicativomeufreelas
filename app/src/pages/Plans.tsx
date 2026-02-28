import AppShell from '@/components/AppShell';
import PaymentModal from '@/components/PaymentModal';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: string;
}

export default function Plans() {
  const [openPlan, setOpenPlan] = useState<null | Plan>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      try {
        // api/plans.php isn't standardized yet to /api/plans but let's assume api helper handles it or we call relative
        // The current api.ts helper appends endpoint to VITE_API_URL.
        // api/plans.php returns { ok: true, items: [...] }
        const res = await api.get('/plans.php');
        if (res.data.ok) {
          setPlans(res.data.items);
        } else {
          toast.error('Erro ao carregar planos');
        }
      } catch (error) {
        console.error(error);
        toast.error('Erro ao carregar planos');
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  return (
    <AppShell wide>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Planos</h1>
        <p className="text-gray-600 mb-6">Escolha um plano para turbinar sua conta.</p>
        
        {loading ? (
          <div className="flex justify-center h-64 items-center">
            <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{p.name}</h3>
                <p className="text-99blue font-bold text-xl mb-4">R$ {p.price}/mês</p>
                <button
                  type="button"
                  onClick={() => setOpenPlan(p)}
                  className="px-4 py-2 bg-99blue text-white rounded hover:bg-99blue-light w-full transition-colors"
                >
                  Assinar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <PaymentModal
        isOpen={!!openPlan}
        onClose={() => setOpenPlan(null)}
        plan={openPlan || { id: '', name: '', price: '' }}
        onSuccess={() => {
          toast.success('Pagamento processado com sucesso!');
          setOpenPlan(null);
        }}
      />
    </AppShell>
  );
}
