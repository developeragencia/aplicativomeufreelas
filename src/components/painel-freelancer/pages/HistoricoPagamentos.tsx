import { DollarSign, Calendar } from 'lucide-react';

const payments = [
  {
    id: 1,
    project: 'Desenvolvimento de Website E-commerce',
    client: 'Empresa ABC',
    amount: 3500.00,
    date: '15/01/2024',
    status: 'pago',
    type: 'recebimento',
  },
  {
    id: 2,
    project: 'Design de Logo',
    client: 'Startup XYZ',
    amount: 800.00,
    date: '10/01/2024',
    status: 'pago',
    type: 'recebimento',
  },
  {
    id: 3,
    project: 'Taxa de Plano Premium',
    client: null,
    amount: -79.90,
    date: '05/01/2024',
    status: 'pago',
    type: 'pagamento',
  },
  {
    id: 4,
    project: 'Redação de Artigos',
    client: 'Blog Tech',
    amount: 1200.00,
    date: '20/12/2023',
    status: 'pago',
    type: 'recebimento',
  },
  {
    id: 5,
    project: 'Consultoria SEO',
    client: 'Agência Digital',
    amount: 2500.00,
    date: '15/12/2023',
    status: 'pendente',
    type: 'recebimento',
  },
];

export default function HistoricoPagamentos() {
  const totalReceived = payments
    .filter(p => p.type === 'recebimento' && p.status === 'pago')
    .reduce((acc, p) => acc + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status === 'pendente')
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Histórico de Pagamentos</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded shadow-sm p-4">
          <p className="text-sm text-[#666] mb-1">Total Recebido</p>
          <p className="text-2xl font-bold text-[#5cb85c]">
            R$ {totalReceived.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded shadow-sm p-4">
          <p className="text-sm text-[#666] mb-1">Pendente</p>
          <p className="text-2xl font-bold text-[#ff9800]">
            R$ {totalPending.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded shadow-sm p-4">
          <p className="text-sm text-[#666] mb-1">Total de Transações</p>
          <p className="text-2xl font-bold text-[#00a8cc]">
            {payments.length}
          </p>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-[#e0e0e0] bg-gray-50">
          <DollarSign className="w-5 h-5 text-[#00a8cc]" />
          <span className="font-medium text-[#333]">Transações</span>
        </div>

        {/* List */}
        <div className="divide-y divide-[#e0e0e0]">
          {payments.map((payment) => (
            <div key={payment.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  payment.type === 'recebimento' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <DollarSign className={`w-5 h-5 ${
                    payment.type === 'recebimento' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>

                {/* Info */}
                <div>
                  <p className="font-medium text-[#333]">{payment.project}</p>
                  {payment.client && (
                    <p className="text-xs text-[#666]">Cliente: {payment.client}</p>
                  )}
                  <p className="text-xs text-[#999] flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    {payment.date}
                  </p>
                </div>
              </div>

              {/* Amount and Status */}
              <div className="text-right">
                <p className={`text-lg font-bold ${
                  payment.type === 'recebimento' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {payment.type === 'recebimento' ? '+' : '-'}
                  R$ {Math.abs(payment.amount).toFixed(2)}
                </p>
                <span className={`text-xs px-2 py-1 rounded ${
                  payment.status === 'pago'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {payment.status === 'pago' ? 'Pago' : 'Pendente'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {payments.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-[#666]">Nenhum pagamento encontrado.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-2 p-4 border-t border-[#e0e0e0]">
          <button className="px-4 py-2 border border-[#ddd] rounded hover:bg-gray-50 text-sm">
            Anterior
          </button>
          <button className="px-4 py-2 bg-[#00a8cc] text-white rounded text-sm">
            1
          </button>
          <button className="px-4 py-2 border border-[#ddd] rounded hover:bg-gray-50 text-sm">
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
