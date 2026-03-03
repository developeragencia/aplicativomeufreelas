import { Search, Star, MapPin, Briefcase } from 'lucide-react';

const freelancers = [
  {
    id: 1,
    name: 'Ana Silva',
    title: 'Desenvolvedora Full Stack',
    rating: 4.9,
    reviews: 47,
    location: 'São Paulo, SP',
    hourlyRate: 'R$ 80/hora',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    completedProjects: 32,
    avatar: 'AS',
  },
  {
    id: 2,
    name: 'Pedro Costa',
    title: 'Designer UI/UX',
    rating: 4.8,
    reviews: 28,
    location: 'Rio de Janeiro, RJ',
    hourlyRate: 'R$ 65/hora',
    skills: ['Figma', 'Adobe XD', 'Prototipagem', 'Design System'],
    completedProjects: 45,
    avatar: 'PC',
  },
  {
    id: 3,
    name: 'Mariana Santos',
    title: 'Redatora SEO',
    rating: 5.0,
    reviews: 62,
    location: 'Belo Horizonte, MG',
    hourlyRate: 'R$ 45/hora',
    skills: ['Copywriting', 'SEO', 'WordPress', 'Marketing de Conteúdo'],
    completedProjects: 78,
    avatar: 'MS',
  },
  {
    id: 4,
    name: 'Lucas Oliveira',
    title: 'Desenvolvedor Mobile',
    rating: 4.7,
    reviews: 19,
    location: 'Curitiba, PR',
    hourlyRate: 'R$ 90/hora',
    skills: ['Flutter', 'React Native', 'iOS', 'Android'],
    completedProjects: 15,
    avatar: 'LO',
  },
  {
    id: 5,
    name: 'Julia Mendes',
    title: 'Especialista em Marketing Digital',
    rating: 4.9,
    reviews: 35,
    location: 'Fortaleza, CE',
    hourlyRate: 'R$ 55/hora',
    skills: ['Google Ads', 'Facebook Ads', 'Analytics', 'SEO'],
    completedProjects: 41,
    avatar: 'JM',
  },
];

export default function BuscarFreelancers() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Buscar Freelancers</h1>
      
      {/* Search */}
      <div className="bg-white rounded shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar freelancers por nome, habilidade ou especialidade..."
            className="w-full pl-10 pr-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
          />
        </div>
      </div>

      {/* Freelancers List */}
      <div className="space-y-4">
        {freelancers.map((freelancer) => (
          <div key={freelancer.id} className="bg-white rounded shadow-sm p-5 card-hover cursor-pointer">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-[#00a8cc] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {freelancer.avatar}
              </div>
              
              {/* Info */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-[#00a8cc] hover:text-[#0088aa]">
                      {freelancer.name}
                    </h3>
                    <p className="text-sm text-[#666]">{freelancer.title}</p>
                  </div>
                  <span className="text-lg font-bold text-[#7cb342]">
                    {freelancer.hourlyRate}
                  </span>
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-4 mb-3 text-sm text-[#666]">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[#ff9800]" fill="#ff9800" />
                    <span className="font-medium">{freelancer.rating}</span>
                    <span>({freelancer.reviews} avaliações)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {freelancer.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {freelancer.completedProjects} projetos concluídos
                  </span>
                </div>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs px-3 py-1 bg-[#f0f3f5] text-[#666] rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
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
