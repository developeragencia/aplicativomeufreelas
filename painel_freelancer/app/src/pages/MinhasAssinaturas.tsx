import { Star, Check, Calendar, CreditCard, ArrowRight } from 'lucide-react';

const currentPlan = {
  name: 'Gratuito',
  price: 0,
  renewalDate: '02/04/2026',
  features: [
    '10 conexões por mês',
    'Renovação mensal',
    'Validade de 30 dias',
    'Perfil básico',
  ],
};

const availablePlans = [
  {
    id: 'basic',
    name: 'Básico',
    price: 29.90,
    features: [
      '30 conexões por mês',
      'Renovação mensal',
      'Validade de 60 dias',
      'Prioridade nas buscas',
    ],
    color: '#00a8cc',
  },
  {
    id: 'pro',
    name: 'Profissional',
    price: 79.90,
    features: [
      '100 conexões por mês',
      'Renovação mensal',
      'Validade de 90 dias',
      'Destaque no perfil',
      'Selo Premium',
    ],
    color: '#9c27b0',
    recommended: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 199.90,
    features: [
      '300 conexões por mês',
      'Renovação mensal',
      'Conexões não expiráveis',
      'Destaque máximo',
      'Suporte prioritário',
    ],
    color: '#ff9800',
  },
];

export default function MinhasAssinaturas() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Minhas Assinaturas</h1>
      
      {/* Current Plan */}
      <div className="bg-white rounded shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#333]">Plano Atual</h2>
          <span className="px-3 py-1 bg-gray-100 text-[#666] rounded-full text-sm">
            Ativo
          </span>
        </div>
        
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <Star className="w-10 h-10 text-gray-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-[#333] mb-1">{currentPlan.name}</h3>
            <p className="text-3xl font-bold text-[#00a8cc] mb-4">
              R$ {currentPlan.price.toFixed(2)}
              <span className="text-base font-normal text-[#666]">/mês</span>
            </p>
            <div className="flex items-center gap-2 text-sm text-[#666] mb-4">
              <Calendar className="w-4 h-4" />
              Próxima renovação: {currentPlan.renewalDate}
            </div>
            <ul className="space-y-2">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-[#666]">
                  <Check className="w-4 h-4 text-[#5cb85c]" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <h2 className="text-xl font-semibold text-[#333] mb-4">Fazer Upgrade</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {availablePlans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded shadow-sm overflow-hidden ${
              plan.recommended ? 'ring-2 ring-[#9c27b0]' : ''
            }`}
          >
            {plan.recommended && (
              <div className="bg-[#9c27b0] text-white text-center py-1 text-xs font-medium">
                RECOMENDADO
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#333] mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold mb-4" style={{ color: plan.color }}>
                R$ {plan.price.toFixed(2)}
                <span className="text-base font-normal text-[#666]">/mês</span>
              </p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-[#666]">
                    <Check className="w-4 h-4 text-[#5cb85c]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-3 rounded font-medium text-white transition-colors duration-200 flex items-center justify-center gap-2"
                style={{ backgroundColor: plan.color }}
              >
                Assinar
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Method */}
      <div className="mt-8 bg-white rounded shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[#333] mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#00a8cc]" />
          Forma de Pagamento
        </h2>
        <div className="flex items-center gap-4 p-4 border border-[#e0e0e0] rounded">
          <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-medium text-[#333]">Visa **** 1234</p>
            <p className="text-sm text-[#666]">Expira em 12/25</p>
          </div>
          <button className="ml-auto text-sm text-[#00a8cc] hover:text-[#0088aa]">
            Alterar
          </button>
        </div>
      </div>
    </div>
  );
}
