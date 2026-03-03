import { useState } from 'react';
import { Plus, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

export default function EditarPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([
    {
      id: 1,
      title: 'Website E-commerce',
      description: 'Loja virtual completa com integração de pagamentos',
      image: '',
      link: 'https://exemplo.com',
    },
    {
      id: 2,
      title: 'Aplicativo Mobile',
      description: 'App de delivery para iOS e Android',
      image: '',
      link: 'https://exemplo.com',
    },
  ]);

  const [newItem, setNewItem] = useState({ title: '', description: '', link: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = () => {
    if (newItem.title && newItem.description) {
      setItems([...items, { ...newItem, id: Date.now(), image: '' }]);
      setNewItem({ title: '', description: '', link: '' });
      setShowAddForm(false);
    }
  };

  const handleDelete = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Editar Portfólio</h1>
      
      <div className="bg-white rounded shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-[#666]">
            Adicione seus projetos mais relevantes para mostrar seu trabalho aos clientes.
          </p>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#00a8cc] hover:bg-[#0088aa] text-white rounded transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            Adicionar Projeto
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-gray-50 rounded p-4 mb-6">
            <h3 className="text-lg font-semibold text-[#333] mb-4">Novo Projeto</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">
                  Título do Projeto
                </label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc] resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">
                  Link do Projeto
                </label>
                <input
                  type="url"
                  value={newItem.link}
                  onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                  placeholder="https://"
                  className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-[#00a8cc] hover:bg-[#0088aa] text-white rounded transition-colors duration-200"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-[#ddd] hover:bg-gray-100 rounded transition-colors duration-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="border border-[#e0e0e0] rounded overflow-hidden group">
              {/* Image Placeholder */}
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-300" />
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#333] mb-2">{item.title}</h3>
                <p className="text-sm text-[#666] mb-3 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between">
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-[#00a8cc] hover:text-[#0088aa]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ver projeto
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-[#d9534f] hover:text-red-700 transition-colors duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-[#666]">Nenhum projeto no portfólio ainda.</p>
            <p className="text-sm text-[#999]">Adicione seus melhores trabalhos!</p>
          </div>
        )}
      </div>
    </div>
  );
}
