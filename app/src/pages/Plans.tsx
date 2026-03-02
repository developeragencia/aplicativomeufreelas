import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppShell from '@/components/AppShell';
import PaymentModal from '@/components/PaymentModal';
import { Check, X, Star, Crown, Shield, Zap, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

export default function Plans() {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Gratuito',
      price: { monthly: 0, yearly: 0 },
      description: 'Para quem está começando a explorar a plataforma.',
      features: [
        'Até 5 propostas por mês',
        'Taxa de serviço de 20%',
        'Perfil básico',
        'Suporte por email',
      ],
      notIncluded: [
        'Destaque em buscas',
        'Ver quem viu seu perfil',
        'Propostas ilimitadas',
        'Selo de verificado',
      ],
      cta: 'Plano Atual',
      popular: false,
    },
    {
      id: 'pro',
      name: 'Profissional',
      price: { monthly: 59.90, yearly: 49.90 }, // yearly price is per month when billed annually
      description: 'Ideal para freelancers que buscam mais visibilidade.',
      features: [
        'Até 50 propostas por mês',
        'Taxa de serviço de 15%',
        'Perfil destacado',
        'Ver quem viu seu perfil',
        'Selo PRO no perfil',
        'Suporte prioritário',
      ],
      notIncluded: [
        'Propostas ilimitadas',
        'Taxa reduzida (10%)',
      ],
      cta: 'Assinar Pro',
      popular: true,
      color: 'blue',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 99.90, yearly: 79.90 },
      description: 'Para quem quer o máximo de resultados e economia.',
      features: [
        'Propostas ILIMITADAS',
        'Taxa de serviço de 10% (Menor do mercado)',
        'Destaque máximo em buscas',
        'Ver quem viu seu perfil',
        'Selo PREMIUM exclusivo',
        'Gerente de conta dedicado',
        'Acesso antecipado a projetos',
      ],
      notIncluded: [],
      cta: 'Assinar Premium',
      popular: false,
      color: 'purple',
    },
  ];

  const faqs = [
    {
      question: 'Posso cancelar a qualquer momento?',
      answer: 'Sim! Você pode cancelar sua assinatura a qualquer momento nas configurações da conta. O acesso aos recursos premium continuará até o final do período pago.',
    },
    {
      question: 'Como funciona o desconto anual?',
      answer: 'Ao escolher o plano anual, você paga o valor total de uma vez com um desconto equivalente a cerca de 2 meses grátis em comparação ao plano mensal.',
    },
    {
      question: 'A taxa de serviço muda imediatamente?',
      answer: 'Sim! Assim que sua assinatura for confirmada, todas as novas propostas e projetos aceitos terão a taxa de serviço reduzida automaticamente.',
    },
    {
      question: 'O que acontece se eu mudar de plano?',
      answer: 'Se você fizer upgrade, a mudança é imediata e cobramos a diferença proporcional. Se fizer downgrade, a mudança ocorre no final do ciclo atual.',
    },
  ];

  const handleSubscribe = (plan: any) => {
    if (plan.id === 'free') return;
    setSelectedPlan(plan);
  };

  return (
    <AppShell wide>
      <div className="bg-gray-50 min-h-screen pb-20">
        
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 pt-16 pb-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white opacity-50 pointer-events-none"></div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 relative z-10">
            Invista na sua carreira freelancer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 relative z-10">
            Aumente suas chances de ser contratado, pague menos taxas e destaque-se da concorrência com nossos planos exclusivos.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 relative z-10">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>Mensal</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-8 bg-99blue rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Anual <span className="text-green-600 text-xs font-bold ml-1 bg-green-100 px-2 py-0.5 rounded-full">-20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`bg-white rounded-2xl shadow-xl border-2 overflow-hidden flex flex-col transition-transform hover:-translate-y-1 ${
                  plan.popular ? 'border-99blue ring-4 ring-blue-50 scale-105 z-10' : 'border-gray-100'
                }`}
              >
                {plan.popular && (
                  <div className="bg-99blue text-white text-center text-sm font-bold py-1.5 uppercase tracking-wide">
                    Mais Popular
                  </div>
                )}
                
                <div className="p-8 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`text-xl font-bold ${plan.id === 'premium' ? 'text-purple-600' : 'text-gray-900'}`}>
                        {plan.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 h-10">{plan.description}</p>
                    </div>
                    {plan.id === 'premium' && <Crown className="w-8 h-8 text-purple-600 fill-purple-50" />}
                    {plan.id === 'pro' && <Star className="w-8 h-8 text-blue-600 fill-blue-50" />}
                    {plan.id === 'free' && <Shield className="w-8 h-8 text-gray-400" />}
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-gray-900">
                      R$ {billingCycle === 'monthly' ? plan.price.monthly.toFixed(2).replace('.', ',') : plan.price.yearly.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-gray-500 font-medium">/mês</span>
                    {billingCycle === 'yearly' && plan.price.monthly > 0 && (
                      <p className="text-xs text-green-600 mt-1 font-medium">
                        Cobrado R$ {(plan.price.yearly * 12).toFixed(2).replace('.', ',')} anualmente
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={plan.id === 'free'}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-sm transition-all mb-8 ${
                      plan.id === 'free'
                        ? 'bg-gray-100 text-gray-400 cursor-default border border-gray-200'
                        : plan.popular
                          ? 'bg-99blue text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {plan.cta}
                  </button>

                  <div className="space-y-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">O que está incluso:</p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                          <Check className={`w-5 h-5 flex-shrink-0 ${plan.id === 'free' ? 'text-gray-400' : 'text-green-500'}`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {plan.notIncluded.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-400">
                          <X className="w-5 h-5 flex-shrink-0 text-gray-300" />
                          <span className="line-through">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Comparison Table (Optional - simplified for now as cards cover most) */}
        
        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Perguntas Frequentes</h2>
            <p className="text-gray-600 mt-2">Tire suas dúvidas sobre nossos planos.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition-colors focus:outline-none"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {faqOpen === idx ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>
                {faqOpen === idx && (
                  <div className="p-5 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-100 bg-gray-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center bg-blue-50 rounded-xl p-8 border border-blue-100">
            <HelpCircle className="w-10 h-10 text-99blue mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Ainda tem dúvidas?</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">Nossa equipe de suporte está pronta para ajudar você a escolher o melhor plano para sua carreira.</p>
            <button className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              Falar com Suporte
            </button>
          </div>
        </div>

      </div>

      {selectedPlan && (
        <PaymentModal
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          plan={{
            id: selectedPlan.id,
            name: selectedPlan.name,
            price: billingCycle === 'monthly' ? selectedPlan.price.monthly.toFixed(2) : (selectedPlan.price.yearly * 12).toFixed(2)
          }}
          onSuccess={() => {
            toast.success(`Assinatura do plano ${selectedPlan.name} confirmada com sucesso!`);
            setSelectedPlan(null);
          }}
        />
      )}
    </AppShell>
  );
}
