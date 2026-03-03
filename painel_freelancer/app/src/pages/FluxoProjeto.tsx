import { ArrowRight, CheckCircle, User, FileText, Handshake, Rocket, Star } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Publicação do Projeto',
    description: 'O cliente publica um projeto detalhando suas necessidades, orçamento e prazo.',
    icon: FileText,
    color: '#00a8cc',
  },
  {
    id: 2,
    title: 'Envio de Propostas',
    description: 'Freelancers interessados enviam propostas com seu valor e plano de trabalho.',
    icon: User,
    color: '#9c27b0',
  },
  {
    id: 3,
    title: 'Seleção do Freelancer',
    description: 'O cliente analisa as propostas e escolhe o freelancer mais adequado.',
    icon: CheckCircle,
    color: '#5cb85c',
  },
  {
    id: 4,
    title: 'Negociação',
    description: 'Cliente e freelancer conversam para alinhar detalhes do projeto.',
    icon: Handshake,
    color: '#ff9800',
  },
  {
    id: 5,
    title: 'Execução do Projeto',
    description: 'O freelancer trabalha no projeto mantendo comunicação com o cliente.',
    icon: Rocket,
    color: '#00bcd4',
  },
  {
    id: 6,
    title: 'Entrega e Avaliação',
    description: 'Projeto é entregue, o cliente avalia e ambos deixam feedback.',
    icon: Star,
    color: '#ffd700',
  },
];

const tips = [
  {
    title: 'Para Freelancers',
    items: [
      'Leia atentamente a descrição do projeto antes de enviar proposta',
      'Seja claro sobre seu valor e prazo de entrega',
      'Mantenha comunicação frequente com o cliente',
      'Entregue sempre no prazo combinado',
      'Peça feedback ao final do projeto',
    ],
  },
  {
    title: 'Para Clientes',
    items: [
      'Descreva seu projeto com o máximo de detalhes possível',
      'Defina um orçamento realista para o trabalho',
      'Analise o portfólio dos freelancers antes de contratar',
      'Mantenha comunicação clara durante o projeto',
      'Deixe uma avaliação honesta ao final',
    ],
  },
];

export default function FluxoProjeto() {
  return (
    <div className="max-w-[1000px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-2">Fluxo de um Projeto</h1>
      <p className="text-[#666] mb-8">
        Entenda como funciona o processo de um projeto na 99Freelas
      </p>
      
      {/* Steps */}
      <div className="bg-white rounded shadow-sm p-8 mb-8">
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-8 top-16 bottom-16 w-0.5 bg-gray-200 hidden md:block" />
          
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-6 relative">
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                  style={{ backgroundColor: step.color }}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: step.color }}
                    >
                      {step.id}
                    </span>
                    <h3 className="text-xl font-semibold text-[#333]">{step.title}</h3>
                  </div>
                  <p className="text-[#666]">{step.description}</p>
                </div>

                {/* Arrow (except last) */}
                {index < steps.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-gray-300 hidden md:block mt-5" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((section, index) => (
          <div key={index} className="bg-white rounded shadow-sm p-6">
            <h2 className="text-lg font-semibold text-[#333] mb-4">{section.title}</h2>
            <ul className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#5cb85c] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <a
          href="/buscar-projetos"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#00a8cc] hover:bg-[#0088aa] text-white font-medium rounded transition-colors duration-200"
        >
          Começar Agora
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}
