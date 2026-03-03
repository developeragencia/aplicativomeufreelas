import { History, ArrowRight, Calendar } from 'lucide-react';

const history = [
  {
    id: 1,
    type: 'uso',
    description: 'Conexão utilizada para enviar proposta',
    project: 'Desenvolvimento de Website',
    date: '15/01/2024',
    quantity: -1,
  },
  {
    id: 2,
    type: 'uso',
    description: 'Conexão utilizada para enviar proposta',
    project: 'Design de Logo',
    date: '10/01/2024',
    quantity: -1,
  },
  {
    id: 3,
    type: 'renovacao',
    description: 'Renovação mensal de conexões',
    project: null,
    date: '01/01/2024',
    quantity: +10,
  },
  {
    id: 4,
    type: 'uso',
    description: 'Conexão utilizada para enviar proposta',
    project: 'Redação de Artigos',
    date: '28/12/2023',
    quantity: -1,
  },
  {
    id: 5,
    type: 'uso',
    description: 'Conexão utilizada para enviar proposta',
    project: 'Consultoria SEO',
    date: '20/12/2023',
    quantity: -1,
  },
  {
    id: 6,
    type: 'compra',
    description: 'Compra de conexões extras',
    project: null,
    date: '15/12/2023',
    quantity: +5,
  },
];

export default function HistoricoConexoes() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Histórico de Conexões</h1>
      
      <div className="bg-white rounded shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-[#e0e0e0] bg-gray-50">
          <History className="w-5 h-5 text-[#00a8cc]" />
          <span className="font-medium text-[#333]">Últimas atividades</span>
        </div>

        {/* List */}
        <div className="divide-y divide-[#e0e0e0]">
          {history.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.quantity > 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {item.quantity > 0 ? (
                    <ArrowRight className="w-5 h-5 text-green-600 rotate-[-45deg]" />
                  ) : (
                    <ArrowRight className="w-5 h-5 text-red-600 rotate-[45deg]" />
                  )}
                </div>

                {/* Info */}
                <div>
                  <p className="text-sm font-medium text-[#333]">{item.description}</p>
                  {item.project && (
                    <p className="text-xs text-[#00a8cc]">{item.project}</p>
                  )}
                  <p className="text-xs text-[#999] flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </p>
                </div>
              </div>

              {/* Quantity */}
              <span className={`text-lg font-bold ${
                item.quantity > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.quantity > 0 ? '+' : ''}{item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {history.length === 0 && (
          <div className="text-center py-12">
            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-[#666]">Nenhuma atividade no histórico.</p>
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
