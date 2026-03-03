import { TrendingUp, DollarSign, Calendar, Download, PieChart } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', amount: 3500 },
  { month: 'Fev', amount: 4200 },
  { month: 'Mar', amount: 2800 },
  { month: 'Abr', amount: 5100 },
  { month: 'Mai', amount: 3900 },
  { month: 'Jun', amount: 4600 },
];

const categories = [
  { name: 'Desenvolvimento', amount: 8500, percentage: 45 },
  { name: 'Design', amount: 4200, percentage: 22 },
  { name: 'Redação', amount: 3800, percentage: 20 },
  { name: 'Consultoria', amount: 2500, percentage: 13 },
];

export default function MeusRendimentos() {
  const totalEarnings = monthlyData.reduce((acc, item) => acc + item.amount, 0);
  const averageEarnings = totalEarnings / monthlyData.length;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Meus Rendimentos</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-[#666]">Total do Período</p>
              <p className="text-2xl font-bold text-[#333]">
                R$ {totalEarnings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-[#666]">Média Mensal</p>
              <p className="text-2xl font-bold text-[#333]">
                R$ {averageEarnings.toFixed(0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-[#666]">Melhor Mês</p>
              <p className="text-2xl font-bold text-[#333]">
                R$ 5.100
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Chart */}
        <div className="bg-white rounded shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#333] mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00a8cc]" />
            Rendimentos Mensais
          </h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {monthlyData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-[#00a8cc] rounded-t transition-all duration-500 hover:bg-[#0088aa]"
                  style={{ height: `${(item.amount / 6000) * 200}px` }}
                />
                <p className="text-xs text-[#666] mt-2">{item.month}</p>
                <p className="text-xs font-medium text-[#333]">
                  R$ {(item.amount / 1000).toFixed(1)}k
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#333] mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#00a8cc]" />
            Por Categoria
          </h2>
          <div className="space-y-4">
            {categories.map((cat, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#333]">{cat.name}</span>
                  <span className="text-[#666]">
                    R$ {cat.amount.toLocaleString()} ({cat.percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00a8cc] rounded-full"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded shadow-sm p-4">
        <h2 className="text-lg font-semibold text-[#333] mb-4">Exportar Dados</h2>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#ddd] rounded hover:bg-gray-50 transition-colors duration-200">
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#ddd] rounded hover:bg-gray-50 transition-colors duration-200">
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#ddd] rounded hover:bg-gray-50 transition-colors duration-200">
            <Download className="w-4 h-4" />
            Relatório Anual
          </button>
        </div>
      </div>
    </div>
  );
}
