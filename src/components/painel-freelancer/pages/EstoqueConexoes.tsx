import { Package, ShoppingCart, Check, Zap, Star } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    connections: 10,
    features: [
      '10 conexões por mês',
      'Renovação mensal',
      'Validade de 30 dias',
    ],
    current: true,
    color: '#666',
  },
  {
    id: 'basic',
    name: 'Básico',
    price: 29.90,
    connections: 30,
    features: [
      '30 conexões por mês',
      'Renovação mensal',
      'Validade de 60 dias',
      'Prioridade nas buscas',
    ],
    current: false,
    color: '#00a8cc',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Profissional',
    price: 79.90,
    connections: 100,
    features: [
      '100 conexões por mês',
      'Renovação mensal',
      'Validade de 90 dias',
      'Destaque no perfil',
      'Selo Premium',
    ],
    current: false,
    color: '#9c27b0',
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 199.90,
    connections: 300,
    features: [
      '300 conexões por mês',
      'Renovação mensal',
      'Conexões não expiráveis',
      'Destaque máximo',
      'Suporte prioritário',
      'Análise de desempenho',
    ],
    current: false,
    color: '#ff9800',
    popular: false,
  },
];

export default function EstoqueConexoes() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-2">Estoque de Conexões</h1>
      <p className="text-[#666] mb-6">
        Escolha o plano ideal para suas necessidades
      </p>

      {/* Current Status */}
      <div className="bg-white rounded shadow-sm p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#00a8cc] flex items-center justify-center">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-sm text-[#666]">Conexões disponíveis</p>
            <p className="text-3xl font-bold text-[#00a8cc]">10</p>
            <p className="text-xs text-[#999]">Plano Gratuito - Renova em 02/04/2026</p>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded shadow-sm overflow-hidden ${
              plan.popular ? 'ring-2 ring-[#9c27b0]' : ''
            }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="bg-[#9c27b0] text-white text-center py-1 text-xs font-medium">
                <Star className="w-3 h-3 inline mr-1" />
                MAIS POPULAR
              </div>
            )}

            {/* Current Badge */}
            {plan.current && (
              <div className="bg-[#5cb85c] text-white text-center py-1 text-xs font-medium">
                <Check className="w-3 h-3 inline mr-1" />
                PLANO ATUAL
              </div>
            )}

            <div className="p-6">
              {/* Plan Name */}
              <h3 className="text-xl font-bold text-[#333] mb-2">{plan.name}</h3>

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold" style={{ color: plan.color }}>
                  R$ {plan.price.toFixed(2)}
                </span>
                <span className="text-[#666]">/mês</span>
              </div>

              {/* Connections */}
              <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded">
                <Zap className="w-5 h-5" style={{ color: plan.color }} />
                <span className="font-medium text-[#333]">{plan.connections} conexões</span>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-[#666]">
                    <Check className="w-4 h-4 text-[#5cb85c] flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                className={`w-full py-3 rounded font-medium transition-colors duration-200 ${
                  plan.current
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'text-white hover:opacity-90'
                }`}
                style={{ backgroundColor: plan.current ? undefined : plan.color }}
                disabled={plan.current}
              >
                {plan.current ? 'Plano Atual' : 'Assinar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Extra Connections */}
      <div className="mt-8 bg-white rounded shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[#333] mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-[#00a8cc]" />
          Comprar Conexões Avulsas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-[#e0e0e0] rounded p-4 text-center hover:border-[#00a8cc] transition-colors duration-200 cursor-pointer">
            <p className="text-2xl font-bold text-[#00a8cc]">5</p>
            <p className="text-sm text-[#666]">conexões</p>
            <p className="text-lg font-semibold text-[#333] mt-2">R$ 19,90</p>
          </div>
          <div className="border border-[#e0e0e0] rounded p-4 text-center hover:border-[#00a8cc] transition-colors duration-200 cursor-pointer">
            <p className="text-2xl font-bold text-[#00a8cc]">10</p>
            <p className="text-sm text-[#666]">conexões</p>
            <p className="text-lg font-semibold text-[#333] mt-2">R$ 34,90</p>
          </div>
          <div className="border border-[#e0e0e0] rounded p-4 text-center hover:border-[#00a8cc] transition-colors duration-200 cursor-pointer">
            <p className="text-2xl font-bold text-[#00a8cc]">20</p>
            <p className="text-sm text-[#666]">conexões</p>
            <p className="text-lg font-semibold text-[#333] mt-2">R$ 59,90</p>
          </div>
        </div>
      </div>
    </div>
  );
}
