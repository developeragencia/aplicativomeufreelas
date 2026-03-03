import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

const posts = [
  {
    id: 1,
    title: 'Como se destacar como freelancer em 2024',
    excerpt: 'Dicas práticas para construir uma carreira de sucesso no mundo freelance, desde a criação do portfólio até a conquista de clientes recorrentes.',
    author: 'Ana Silva',
    date: '15/01/2024',
    category: 'Carreira',
    image: null,
  },
  {
    id: 2,
    title: 'Guia completo de precificação para freelancers',
    excerpt: 'Aprenda a calcular o valor ideal para seus serviços, considerando experiência, mercado e custos operacionais.',
    author: 'Pedro Costa',
    date: '10/01/2024',
    category: 'Negócios',
    image: null,
  },
  {
    id: 3,
    title: 'Ferramentas essenciais para freelancers',
    excerpt: 'Conheça as melhores ferramentas para organizar seus projetos, comunicar-se com clientes e aumentar sua produtividade.',
    author: 'Mariana Santos',
    date: '05/01/2024',
    category: 'Produtividade',
    image: null,
  },
  {
    id: 4,
    title: 'Como lidar com clientes difíceis',
    excerpt: 'Estratégias para manter relacionamentos profissionais saudáveis e resolver conflitos de forma construtiva.',
    author: 'Lucas Oliveira',
    date: '28/12/2023',
    category: 'Relacionamento',
    image: null,
  },
  {
    id: 5,
    title: 'Tendências de design para 2024',
    excerpt: 'Fique por dentro das últimas tendências em design gráfico, UI/UX e branding para se manter atualizado no mercado.',
    author: 'Julia Mendes',
    date: '20/12/2023',
    category: 'Design',
    image: null,
  },
  {
    id: 6,
    title: 'Marketing pessoal para freelancers',
    excerpt: 'Aprenda a promover seus serviços de forma eficaz nas redes sociais e construir uma marca pessoal forte.',
    author: 'Carlos Eduardo',
    date: '15/12/2023',
    category: 'Marketing',
    image: null,
  },
];

const categories = [
  'Todos',
  'Carreira',
  'Negócios',
  'Produtividade',
  'Relacionamento',
  'Design',
  'Marketing',
  'Tecnologia',
];

export default function Blog() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#333] mb-4">Blog 99Freelas</h1>
        <p className="text-lg text-[#666] max-w-2xl mx-auto">
          Dicas, tutoriais e novidades para impulsionar sua carreira freelance
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
              index === 0
                ? 'bg-[#00a8cc] text-white'
                : 'bg-white text-[#666] hover:bg-gray-100 border border-[#e0e0e0]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured Post */}
      <div className="bg-white rounded shadow-sm overflow-hidden mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="h-64 md:h-auto bg-gradient-to-br from-[#00a8cc] to-[#0088aa] flex items-center justify-center">
            <span className="text-white text-6xl font-bold">99</span>
          </div>
          <div className="p-8">
            <span className="inline-block px-3 py-1 bg-[#00a8cc] text-white text-xs rounded-full mb-4">
              Destaque
            </span>
            <h2 className="text-2xl font-bold text-[#333] mb-4">
              Como se destacar como freelancer em 2024
            </h2>
            <p className="text-[#666] mb-4">
              Dicas práticas para construir uma carreira de sucesso no mundo freelance, 
              desde a criação do portfólio até a conquista de clientes recorrentes.
            </p>
            <div className="flex items-center gap-4 text-sm text-[#666] mb-6">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                Ana Silva
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                15/01/2024
              </span>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-[#00a8cc] hover:text-[#0088aa] font-medium"
            >
              Ler mais
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(1).map((post) => (
          <article key={post.id} className="bg-white rounded shadow-sm overflow-hidden card-hover">
            {/* Image Placeholder */}
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-300 text-4xl font-bold">99</span>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-3 h-3 text-[#00a8cc]" />
                <span className="text-xs text-[#00a8cc]">{post.category}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-[#333] mb-2 line-clamp-2">
                {post.title}
              </h3>
              
              <p className="text-sm text-[#666] mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-xs text-[#999]">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-8">
        <button className="px-4 py-2 border border-[#ddd] rounded hover:bg-gray-50 text-sm">
          Anterior
        </button>
        <button className="px-4 py-2 bg-[#00a8cc] text-white rounded text-sm">
          1
        </button>
        <button className="px-4 py-2 border border-[#ddd] rounded hover:bg-gray-50 text-sm">
          2
        </button>
        <button className="px-4 py-2 border border-[#ddd] rounded hover:bg-gray-50 text-sm">
          3
        </button>
        <button className="px-4 py-2 border border-[#ddd] rounded hover:bg-gray-50 text-sm">
          Próximo
        </button>
      </div>

      {/* Newsletter */}
      <div className="mt-12 bg-[#00a8cc] rounded p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Assine nossa newsletter</h2>
        <p className="text-white/80 mb-6">
          Receba as últimas dicas e novidades diretamente no seu e-mail
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Seu e-mail"
            className="flex-1 px-4 py-3 rounded focus:outline-none"
          />
          <button className="px-6 py-3 bg-[#2c3e50] hover:bg-[#1a252f] text-white font-medium rounded transition-colors duration-200">
            Assinar
          </button>
        </div>
      </div>
    </div>
  );
}
