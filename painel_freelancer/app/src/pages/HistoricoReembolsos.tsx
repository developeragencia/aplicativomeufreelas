import { RotateCcw, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

const refunds = [
  {
    id: 1,
    description: 'Reembolso de conexões não utilizadas',
    amount: 29.90,
    date: '15/01/2024',
    status: 'aprovado',
    reason: 'Upgrade de plano',
  },
  {
    id: 2,
    description: 'Reembolso de taxa de projeto',
    amount: 150.00,
    date: '10/01/2024',
    status: 'pendente',
    reason: 'Projeto cancelado pelo cliente',
  },
  {
    id: 3,
    description: 'Reembolso de assinatura',
    amount: 79.90,
    date: '05/12/2023',
    status: 'aprovado',
    reason: 'Cancelamento dentro do prazo',
  },
  {
    id: 4,
    description: 'Reembolso de conexões',
    amount: 19.90,
    date: '20/11/2023',
    status: 'rejeitado',
    reason: 'Prazo expirado',
  },
];

export default function HistoricoReembolsos() {
  const totalApproved = refunds
    .filter(r => r.status === 'aprovado')
    .reduce((acc, r) => acc + r.amount, 0);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Histórico de Reembolsos</h1>
      
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded shadow-sm p-4">
          <p className="text-sm text-[#666] mb-1">Total Reembolsado</p>
          <p className="text-2xl font-bold text-[#5cb85c]">
            R$ {totalApproved.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded shadow-sm p-4">
          <p className="text-sm text-[#666] mb-1">Reembolsos Pendentes</p>
          <p className="text-2xl font-bold text-[#ff9800]">
            {refunds.filter(r => r.status === 'pendente').length}
          </p>
        </div>
      </div>

      {/* Refunds List */}
      <div className="bg-white rounded shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-[#e0e0e0] bg-gray-50">
          <RotateCcw className="w-5 h-5 text-[#00a8cc]" />
          <span className="font-medium text-[#333]">Reembolsos</span>
        </div>

        {/* List */}
        <div className="divide-y divide-[#e0e0e0]">
          {refunds.map((refund) => (
            <div key={refund.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    refund.status === 'aprovado' ? 'bg-green-100' :
                    refund.status === 'pendente' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    {refund.status === 'aprovado' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : refund.status === 'pendente' ? (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <p className="font-medium text-[#333]">{refund.description}</p>
                    <p className="text-xs text-[#666]">Motivo: {refund.reason}</p>
                    <p className="text-xs text-[#999] flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {refund.date}
                    </p>
                  </div>
                </div>

                {/* Amount and Status */}
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    + R$ {refund.amount.toFixed(2)}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    refund.status === 'aprovado'
                      ? 'bg-green-100 text-green-700'
                      : refund.status === 'pendente'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {refund.status === 'aprovado' ? 'Aprovado' : 
                     refund.status === 'pendente' ? 'Pendente' : 'Rejeitado'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {refunds.length === 0 && (
          <div className="text-center py-12">
            <RotateCcw className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-[#666]">Nenhum reembolso encontrado.</p>
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
