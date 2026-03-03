import { Bookmark, Trash2, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface SavedProject {
  id: number;
  title: string;
  description: string;
  budget: string;
  savedDate: string;
}

export default function ProjetosSalvos() {
  const [projects, setProjects] = useState<SavedProject[]>([
    {
      id: 1,
      title: 'Desenvolvimento de App Mobile',
      description: 'Aplicativo de delivery para restaurantes com integração de pagamentos.',
      budget: 'R$ 8.000 - R$ 12.000',
      savedDate: '20/01/2024',
    },
    {
      id: 2,
      title: 'Redesign de Website Corporativo',
      description: 'Modernização completa do site de empresa de tecnologia.',
      budget: 'R$ 5.000 - R$ 7.000',
      savedDate: '18/01/2024',
    },
    {
      id: 3,
      title: 'Campanha de Marketing Digital',
      description: 'Gestão de redes sociais e anúncios para e-commerce.',
      budget: 'R$ 3.000/mês',
      savedDate: '15/01/2024',
    },
  ]);

  const handleRemove = (id: number) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Projetos Salvos</h1>
      
      <div className="bg-white rounded shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-[#e0e0e0] bg-gray-50">
          <Bookmark className="w-5 h-5 text-[#00a8cc]" />
          <span className="font-medium text-[#333]">
            {projects.length} projetos salvos
          </span>
        </div>

        {/* List */}
        {projects.length > 0 ? (
          <div className="divide-y divide-[#e0e0e0]">
            {projects.map((project) => (
              <div key={project.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#00a8cc] hover:text-[#0088aa] mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[#666] mb-2">{project.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-[#7cb342] font-medium">{project.budget}</span>
                      <span className="text-[#999]">Salvo em {project.savedDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <a
                      href="#"
                      className="p-2 text-[#00a8cc] hover:bg-blue-50 rounded transition-colors duration-200"
                      title="Ver projeto"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => handleRemove(project.id)}
                      className="p-2 text-[#d9534f] hover:bg-red-50 rounded transition-colors duration-200"
                      title="Remover"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-[#666]">Nenhum projeto salvo.</p>
            <p className="text-sm text-[#999]">Salve projetos interessantes para ver depois.</p>
            <a
              href="/buscar-projetos"
              className="inline-block mt-4 px-6 py-2 bg-[#00a8cc] hover:bg-[#0088aa] text-white rounded transition-colors duration-200"
            >
              Buscar Projetos
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
