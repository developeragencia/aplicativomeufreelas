import { useState } from 'react';
import { Calculator, DollarSign, Clock, TrendingUp, Info } from 'lucide-react';

export default function CalculadoraFreelancer() {
  const [hourlyRate, setHourlyRate] = useState(50);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [weeksPerMonth, setWeeksPerMonth] = useState(4);
  const [expenses, setExpenses] = useState(1000);

  const monthlyIncome = hourlyRate * hoursPerDay * daysPerWeek * weeksPerMonth;
  const netIncome = monthlyIncome - expenses;
  const yearlyIncome = monthlyIncome * 12;
  const dailyIncome = hourlyRate * hoursPerDay;

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-2">Calculadora Freelancer</h1>
      <p className="text-[#666] mb-6">
        Calcule seus rendimentos e planeje sua carreira freelancer
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Inputs */}
        <div className="bg-white rounded shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#333] mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#00a8cc]" />
            Dados do Cálculo
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">
                Valor Hora (R$)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">
                Horas por Dia
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">
                Dias por Semana
              </label>
              <input
                type="number"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">
                Semanas por Mês
              </label>
              <input
                type="number"
                value={weeksPerMonth}
                onChange={(e) => setWeeksPerMonth(Number(e.target.value))}
                className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">
                Despesas Mensais (R$)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={expenses}
                  onChange={(e) => setExpenses(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="bg-white rounded shadow-sm p-6">
            <h2 className="text-lg font-semibold text-[#333] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#00a8cc]" />
              Resultados
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-[#666] mb-1">Renda Mensal Bruta</p>
                <p className="text-3xl font-bold text-green-600">
                  R$ {monthlyIncome.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-[#666] mb-1">Renda Mensal Líquida</p>
                <p className="text-3xl font-bold text-blue-600">
                  R$ {netIncome.toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-[#666] mb-1">Renda Diária</p>
                  <p className="text-xl font-bold text-[#333]">
                    R$ {dailyIncome.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-[#666] mb-1">Renda Anual</p>
                  <p className="text-xl font-bold text-[#333]">
                    R$ {yearlyIncome.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded">
                <p className="text-sm text-[#666] mb-1">Horas por Mês</p>
                <p className="text-xl font-bold text-purple-600">
                  {hoursPerDay * daysPerWeek * weeksPerMonth} horas
                </p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800 mb-1">Dica</p>
                <p className="text-sm text-yellow-700">
                  Considere incluir no cálculo: impostos, reserva de emergência, 
                  fundo de férias e benefícios que teria em um emprego CLT.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
