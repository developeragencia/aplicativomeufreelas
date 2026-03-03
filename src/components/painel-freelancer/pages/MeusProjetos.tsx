import { Folder, Clock, CheckCircle, XCircle, AlertCircle, DollarSign, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Project {
  id: number;
  title: string;
  client: string;
  value: number;
  status: 'andamento' | 'concluido' | 'cancelado' | 'pendente';
  startDate: string;
  deadline: string;
  progress: number;
}

export default function MeusProjetos() {
  const [filter, setFilter] = useState('todos');
  const [projects] = useState<Project[]>([
    {
      id: 1,
      title: 'Desenvolvimento de Website',
      client: 'Empresa ABC',
      value: 5000,
      status: 'andamento',
      startDate: '01/01/2024',
      deadline: '15/02/2024',
      progress: 60,
    },
    {
      id: 2,
      title: 'Design de Logo',
      client: 'Startup XYZ',
      value: 1200,
      status: 'concluido',
      startDate: '10/12/2023',
      deadline: '20/12/2023',
      progress: 100,
    },
    {
      id: 3,
      title: 'Redação de Artigos',
      client: 'Blog Tech',
      value: 800,
      status: 'pendente',
      startDate: '25/01/2024',
      deadline: '05/02/2024',
      progress: 0,
    },
    {
      id: 4,
      title: 'Consultoria SEO',
      client: 'Agência Digital',
      value: 2500,
      status: 'cancelado',
      startDate: '05/12/2023',
      deadline: '05/01/2024',
      progress: 30,
    },
  ]);

  const filteredProjects = filter === 'todos' 
    ? projects 
    : projects.filter(p => p.status === filter);

  const stats = {
    total: projects.length,
    andamento: projects.filter(p => p.status === 'andamento').length,
    concluido: projects.filter(p => p.status === 'concluido').length,
    cancelado: projects.filter(p => p.status === 'cancelado').length,
    pendente: projects.filter(p => p.status === 'pendente').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'andamento':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'concluido':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelado':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pendente':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'andamento':
        return 'Em andamento';
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      case 'pendente':
        return 'Pendente';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Meus Projetos</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <button
          onClick={() => setFilter('todos')}
          className={`p-4 rounded text-center transition-colors duration-200 ${
            filter === 'todos' ? 'bg-[#00a8cc] text-white' : 'bg-white hover:bg-gray-50'
          }`}
        >
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className={`text-sm ${filter === 'todos' ? 'text-white/80' : 'text-[#666]'}`}>Todos</p>
        </button>
        <button
          onClick={() => setFilter('andamento')}
          className={`p-4 rounded text-center transition-colors duration-200 ${
            filter === 'andamento' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'
          }`}
        >
          <p className="text-2xl font-bold">{stats.andamento}</p>
          <p className={`text-sm ${filter === 'andamento' ? 'text-white/80' : 'text-[#666]'}`}>Em andamento</p>
        </button>
        <button
          onClick={() => setFilter('concluido')}
          className={`p-4 rounded text-center transition-colors duration-200 ${
            filter === 'concluido' ? 'bg-green-500 text-white' : 'bg-white hover:bg-gray-50'
          }`}
        >
          <p className="text-2xl font-bold">{stats.concluido}</p>
          <p className={`text-sm ${filter === 'concluido' ? 'text-white/80' : 'text-[#666]'}`}>Concluídos</p>
        </button>
        <button
          onClick={() => setFilter('pendente')}
          className={`p-4 rounded text-center transition-colors duration-200 ${
            filter === 'pendente' ? 'bg-yellow-500 text-white' : 'bg-white hover:bg-gray-50'
          }`}
        >
          <p className="text-2xl font-bold">{stats.pendente}</p>
          <p className={`text-sm ${filter === 'pendente' ? 'text-white/80' : 'text-[#666]'}`}>Pendentes</p>
        </button>
        <button
          onClick={() => setFilter('cancelado')}
          className={`p-4 rounded text-center transition-colors duration-200 ${
            filter === 'cancelado' ? 'bg-red-500 text-white' : 'bg-white hover:bg-gray-50'
          }`}
        >
          <p className="text-2xl font-bold">{stats.cancelado}</p>
          <p className={`text-sm ${filter === 'cancelado' ? 'text-white/80' : 'text-[#666]'}`}>Cancelados</p>
        </button>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded shadow-sm">
        <div className="flex items-center gap-3 p-4 border-b border-[#e0e0e0] bg-gray-50">
          <Folder className="w-5 h-5 text-[#00a8cc]" />
          <span className="font-medium text-[#333]">Lista de Projetos</span>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="divide-y divide-[#e0e0e0]">
            {filteredProjects.map((project) => (
              <div key={project.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[#333]">{project.title}</h3>
                      <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-gray-100">
                        {getStatusIcon(project.status)}
                        {getStatusLabel(project.status)}
                      </span>
                    </div>
                    <p className="text-sm text-[#666] mb-2">Cliente: {project.client}</p>
                    <div className="flex items-center gap-4 text-sm text-[#666]">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-[#7cb342]" />
                        R$ {project.value.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {project.startDate} - {project.deadline}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    {project.status === 'andamento' && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-[#666] mb-1">
                          <span>Progresso</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <button className="px-4 py-2 text-sm text-[#00a8cc] hover:bg-blue-50 rounded transition-colors duration-200">
                      Ver detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-[#666]">Nenhum projeto encontrado.</p>
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
