import { Search, Filter, MapPin, DollarSign, Calendar } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Desenvolvimento de Website E-commerce',
    description: 'Preciso de um desenvolvedor para criar um e-commerce completo com integração de pagamentos.',
    budget: 'R$ 3.000 - R$ 5.000',
    deadline: '30 dias',
    location: 'Remoto',
    skills: ['React', 'Node.js', 'Stripe'],
    proposals: 12,
  },
  {
    id: 2,
    title: 'Designer UI/UX para Aplicativo Mobile',
    description: 'Busco designer experiente para criar interfaces de um app de delivery.',
    budget: 'R$ 2.000 - R$ 4.000',
    deadline: '20 dias',
    location: 'São Paulo, SP',
    skills: ['Figma', 'UI Design', 'UX Research'],
    proposals: 8,
  },
  {
    id: 3,
    title: 'Redator de Conteúdo para Blog',
    description: 'Preciso de redator para criar 10 artigos sobre tecnologia e inovação.',
    budget: 'R$ 500 - R$ 1.000',
    deadline: '15 dias',
    location: 'Remoto',
    skills: ['Copywriting', 'SEO', 'WordPress'],
    proposals: 25,
  },
  {
    id: 4,
    title: 'Desenvolvedor Python para Automação',
    description: 'Criar scripts de automação para processamento de dados em planilhas.',
    budget: 'R$ 1.500 - R$ 2.500',
    deadline: '10 dias',
    location: 'Remoto',
    skills: ['Python', 'Pandas', 'Excel'],
    proposals: 6,
  },
  {
    id: 5,
    title: 'Marketing Digital - Gestão de Redes Sociais',
    description: 'Gerenciar Instagram e Facebook de empresa de moda feminina.',
    budget: 'R$ 1.000 - R$ 2.000/mês',
    deadline: 'Recorrente',
    location: 'Rio de Janeiro, RJ',
    skills: ['Social Media', 'Canva', 'Analytics'],
    proposals: 18,
  },
];

export default function BuscarProjetos() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Buscar Projetos</h1>
      
      {/* Search and Filter */}
      <div className="bg-white rounded shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar projetos por palavra-chave..."
              className="w-full pl-10 pr-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00a8cc] hover:bg-[#0088aa] text-white rounded transition-colors duration-200">
            <Filter className="w-5 h-5" />
            Filtros
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded shadow-sm p-5 card-hover cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-[#00a8cc] hover:text-[#0088aa]">
                {project.title}
              </h3>
              <span className="text-sm text-[#666] bg-gray-100 px-3 py-1 rounded">
                {project.proposals} propostas
              </span>
            </div>
            
            <p className="text-sm text-[#666] mb-4 line-clamp-2">
              {project.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#666] mb-4">
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-[#7cb342]" />
                {project.budget}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-[#00bcd4]" />
                {project.deadline}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#ff9800]" />
                {project.location}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill, index) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1 bg-[#f0f3f5] text-[#666] rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
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
    </div>
  );
}
