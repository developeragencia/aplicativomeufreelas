import { Search, FileText, Handshake, DollarSign, Star, Shield } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Encontre Projetos',
    description: 'Busque entre milhares de projetos publicados diariamente nas mais diversas áreas.',
    color: '#00a8cc',
  },
  {
    icon: FileText,
    title: 'Envie Propostas',
    description: 'Escolha os projetos que mais combinam com suas habilidades e envie propostas personalizadas.',
    color: '#9c27b0',
  },
  {
    icon: Handshake,
    title: 'Negocie',
    description: 'Converse diretamente com o cliente para alinhar detalhes, prazos e valores.',
    color: '#5cb85c',
  },
  {
    icon: DollarSign,
    title: 'Receba pelo Trabalho',
    description: 'Trabalhe de forma segura e receba pelo seu trabalho diretamente na plataforma.',
    color: '#ff9800',
  },
  {
    icon: Star,
    title: 'Construa sua Reputação',
    description: 'Receba avaliações dos clientes e construa um perfil de destaque.',
    color: '#ffd700',
  },
  {
    icon: Shield,
    title: 'Pagamento Seguro',
    description: 'Garantimos a segurança dos pagamentos entre freelancers e clientes.',
    color: '#00bcd4',
  },
];

const stats = [
  { value: '500K+', label: 'Freelancers' },
  { value: '1M+', label: 'Projetos' },
  { value: 'R$ 500M+', label: 'Pagos' },
  { value: '98%', label: 'Satisfação' },
];

const faqs = [
  {
    question: 'Como me cadastrar como freelancer?',
    answer: 'Basta criar uma conta gratuita, preencher seu perfil com suas habilidades e experiências, e começar a enviar propostas para os projetos.',
  },
  {
    question: 'Quanto custa usar a plataforma?',
    answer: 'O cadastro é gratuito! Você recebe 10 conexões por mês no plano gratuito. Planos pagos oferecem mais conexões e benefícios.',
  },
  {
    question: 'Como recebo pelos projetos?',
    answer: 'Os pagamentos são processados diretamente na plataforma. Você pode sacar para sua conta bancária quando quiser.',
  },
  {
    question: 'É seguro trabalhar pela plataforma?',
    answer: 'Sim! Oferecemos proteção para freelancers e clientes, com sistema de avaliações e suporte dedicado.',
  },
];

export default function ComoFunciona() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#333] mb-4">Como Funciona a 99Freelas</h1>
        <p className="text-lg text-[#666] max-w-2xl mx-auto">
          A maior plataforma de freelancers do Brasil. Conectamos talentos a oportunidades 
          de trabalho remoto de forma simples e segura.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded shadow-sm p-6 text-center">
            <p className="text-3xl font-bold text-[#00a8cc] mb-1">{stat.value}</p>
            <p className="text-sm text-[#666]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#333] mb-6 text-center">
          Por que usar a 99Freelas?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded shadow-sm p-6 text-center card-hover">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: feature.color }}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#333] mb-2">{feature.title}</h3>
              <p className="text-[#666]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works Steps */}
      <div className="bg-white rounded shadow-sm p-8 mb-12">
        <h2 className="text-2xl font-bold text-[#333] mb-8 text-center">
          Passo a Passo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#00a8cc] rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-semibold text-[#333] mb-2">Crie sua Conta</h3>
            <p className="text-sm text-[#666]">Cadastre-se gratuitamente e complete seu perfil</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#9c27b0] rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-semibold text-[#333] mb-2">Busque Projetos</h3>
            <p className="text-sm text-[#666]">Encontre projetos que combinam com suas habilidades</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#5cb85c] rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold text-[#333] mb-2">Envie Propostas</h3>
            <p className="text-sm text-[#666]">Mostre por que você é o ideal para o projeto</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#ff9800] rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="font-semibold text-[#333] mb-2">Trabalhe e Ganhe</h3>
            <p className="text-sm text-[#666]">Execute o projeto e receba pelo seu trabalho</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded shadow-sm p-8">
        <h2 className="text-2xl font-bold text-[#333] mb-6 text-center">
          Perguntas Frequentes
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-[#e0e0e0] pb-4 last:border-0">
              <h3 className="font-semibold text-[#333] mb-2">{faq.question}</h3>
              <p className="text-[#666]">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-[#333] mb-4">
          Pronto para começar?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/buscar-projetos"
            className="px-8 py-4 bg-[#00a8cc] hover:bg-[#0088aa] text-white font-medium rounded transition-colors duration-200"
          >
            Buscar Projetos
          </a>
          <a
            href="/buscar-freelancers"
            className="px-8 py-4 border border-[#00a8cc] text-[#00a8cc] hover:bg-[#00a8cc] hover:text-white font-medium rounded transition-colors duration-200"
          >
            Ver Freelancers
          </a>
        </div>
      </div>
    </div>
  );
}
