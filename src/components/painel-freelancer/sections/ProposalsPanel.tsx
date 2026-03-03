import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface ProposalsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function ProposalsPanel({ isOpen, onToggle }: ProposalsPanelProps) {
  return (
    <div className="bg-white rounded shadow-sm border border-[#e0e0e0] overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
      >
        <h3 className="text-base font-semibold text-[#333]">Minhas propostas</h3>
        <ChevronDown
          className={`w-5 h-5 text-[#666] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4">
          {/* Filter Select */}
          <div className="flex justify-end mb-4">
            <select className="px-3 py-2 text-sm border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc] bg-white">
              <option>Todas</option>
              <option>Pendentes</option>
              <option>Aceitas</option>
              <option>Recusadas</option>
            </select>
          </div>

          {/* Empty State */}
          <div className="text-center py-8">
            <p className="text-sm text-[#666]">
              Nenhuma proposta foi encontrada.{' '}
              <Link to="/buscar-projetos" className="text-[#00a8cc] hover:text-[#0088aa] link-hover">
                Buscar Projetos.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
