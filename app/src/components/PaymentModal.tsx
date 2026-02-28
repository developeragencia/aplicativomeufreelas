import { useState } from 'react';
import { X, Loader2, Lock } from 'lucide-react';

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  plan: { id: string; name: string; price: string };
  onSuccess: () => void;
};

export default function PaymentModal({ isOpen, onClose, plan, onSuccess }: PaymentModalProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handlePayNow() {
    setProcessing(true);
    setError(null);
    try {
      onSuccess();
      onClose();
    } catch (e: any) {
      setError(e.message || 'Erro ao processar pagamento');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Assinar {plan.name}</h2>
        <div className="flex justify-between items-baseline mb-6 border-b pb-4">
          <span className="text-gray-600">Total a pagar:</span>
          <span className="text-xl font-bold text-99blue">R$ {plan.price}</span>
        </div>
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <button
          type="button"
          onClick={handlePayNow}
          disabled={processing}
          className="w-full py-3 px-4 bg-99blue text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2 transition-all"
        >
          {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Lock className="w-4 h-4" /> Pagar Agora</>}
        </button>
        <div className="mt-6 flex justify-center items-center gap-2 text-xs text-gray-400">
          <Lock className="w-3 h-3" />
          <span>Pagamento seguro</span>
        </div>
      </div>
    </div>
  );
}
