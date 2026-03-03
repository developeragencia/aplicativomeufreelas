import { CreditCard, Plus, Trash2, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface Card {
  id: number;
  number: string;
  holder: string;
  expiry: string;
  brand: string;
  default: boolean;
}

export default function CartoesCredito() {
  const [cards, setCards] = useState<Card[]>([
    {
      id: 1,
      number: '**** **** **** 1234',
      holder: 'Hugo Carvana',
      expiry: '12/25',
      brand: 'Visa',
      default: true,
    },
    {
      id: 2,
      number: '**** **** **** 5678',
      holder: 'Hugo Carvana',
      expiry: '08/26',
      brand: 'Mastercard',
      default: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const handleDelete = (id: number) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const setDefault = (id: number) => {
    setCards(cards.map(card => ({
      ...card,
      default: card.id === id,
    })));
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Cartões de Crédito</h1>
      
      <div className="bg-white rounded shadow-sm p-6">
        {/* Add Button */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-3 bg-[#00a8cc] hover:bg-[#0088aa] text-white rounded transition-colors duration-200 mb-6"
        >
          <Plus className="w-5 h-5" />
          Adicionar Cartão
        </button>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-gray-50 rounded p-4 mb-6">
            <h3 className="text-lg font-semibold text-[#333] mb-4">Novo Cartão</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">
                  Número do Cartão
                </label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-2">
                    Validade
                  </label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">
                  Nome no Cartão
                </label>
                <input
                  type="text"
                  placeholder="Como aparece no cartão"
                  className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
                />
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-[#00a8cc] hover:bg-[#0088aa] text-white rounded transition-colors duration-200">
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

        {/* Cards List */}
        <div className="space-y-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`border rounded p-4 ${
                card.default ? 'border-[#00a8cc] bg-blue-50' : 'border-[#e0e0e0]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Card Icon */}
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>

                  {/* Card Info */}
                  <div>
                    <p className="font-medium text-[#333]">{card.number}</p>
                    <p className="text-sm text-[#666]">
                      {card.holder} • Válido até {card.expiry}
                    </p>
                    {card.default && (
                      <span className="inline-flex items-center gap-1 text-xs text-[#5cb85c] mt-1">
                        <CheckCircle className="w-3 h-3" />
                        Principal
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!card.default && (
                    <button
                      onClick={() => setDefault(card.id)}
                      className="text-sm text-[#00a8cc] hover:text-[#0088aa] px-3 py-1"
                    >
                      Tornar principal
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="text-[#d9534f] hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cards.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-[#666]">Nenhum cartão cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
