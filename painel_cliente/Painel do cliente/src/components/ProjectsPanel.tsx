import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const ProjectsPanel = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  const filters = ['Todos', 'Publicados', 'Em andamento', 'Concluídos', 'Cancelados'];

  return (
    <div className="bg-white border border-freelas-border rounded shadow-card p-5 animate-fade-in-up stagger-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center gap-2 text-lg font-semibold text-freelas-text hover:text-freelas-primary transition-colors"
        >
          Meus projetos
          <ChevronDown
            className={`w-5 h-5 transition-transform ${filterOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Filter Dropdown */}
      <div className="relative mb-6">
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center justify-between w-48 px-3 py-2 border border-freelas-border rounded text-sm text-freelas-text hover:border-freelas-primary transition-colors"
        >
          {selectedFilter}
          <ChevronDown className="w-4 h-4 text-freelas-text-muted" />
        </button>
        {filterOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-freelas-border rounded shadow-dropdown z-10 animate-slide-down">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setSelectedFilter(filter);
                  setFilterOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-freelas-text hover:bg-freelas-bg transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Empty State */}
      <div className="text-center py-8">
        <p className="text-sm text-freelas-text-secondary">
          Nenhum projeto foi encontrado.{" "}
          <a
            href="#"
            className="text-freelas-primary hover:underline transition-all"
          >
            Publicar Projeto
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default ProjectsPanel;
