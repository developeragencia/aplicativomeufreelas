import { useState } from 'react';
import { Building2, Plus, Trash2, CheckCircle, Wallet } from 'lucide-react';

interface BankAccount {
  id: number;
  bank: string;
  agency: string;
  account: string;
  type: string;
  holder: string;
  default: boolean;
}

export default function ContaBancaria() {
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: 1,
      bank: 'Banco do Brasil',
      agency: '1234',
      account: '12345-6',
      type: 'Conta Corrente',
      holder: 'Hugo Carvana',
      default: true,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const handleDelete = (id: number) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
  };

  const setDefault = (id: number) => {
    setAccounts(accounts.map(acc => ({
      ...acc,
      default: acc.id === id,
    })));
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Conta Bancária</h1>
      
      <div className="bg-white rounded shadow-sm p-6">
        {/* Info */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded mb-6">
          <Wallet className="w-5 h-5 text-[#00a8cc]" />
          <p className="text-sm text-[#666]">
            Adicione sua conta bancária para receber pagamentos dos projetos.
          </p>
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-3 bg-[#00a8cc] hover:bg-[#0088aa] text-white rounded transition-colors duration-200 mb-6"
        >
          <Plus className="w-5 h-5" />
          Adicionar Conta
        </button>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-gray-50 rounded p-4 mb-6">
            <h3 className="text-lg font-semibold text-[#333] mb-4">Nova Conta Bancária</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">
                  Banco
                </label>
                <select className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc] bg-white">
                  <option>Selecione o banco</option>
                  <option>Banco do Brasil</option>
                  <option>Bradesco</option>
                  <option>Caixa Econômica</option>
                  <option>Itaú</option>
                  <option>Nubank</option>
                  <option>Santander</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-2">
                    Agência
                  </label>
                  <input
                    type="text"
                    placeholder="0000"
                    className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-2">
                    Conta
                  </label>
                  <input
                    type="text"
                    placeholder="00000-0"
                    className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">
                  Tipo de Conta
                </label>
                <select className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc] bg-white">
                  <option>Conta Corrente</option>
                  <option>Conta Poupança</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">
                  Titular da Conta
                </label>
                <input
                  type="text"
                  placeholder="Nome completo do titular"
                  className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">
                  CPF do Titular
                </label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
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

        {/* Accounts List */}
        <div className="space-y-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className={`border rounded p-4 ${
                account.default ? 'border-[#00a8cc] bg-blue-50' : 'border-[#e0e0e0]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Bank Icon */}
                  <div className="w-12 h-12 bg-[#00a8cc] rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>

                  {/* Account Info */}
                  <div>
                    <p className="font-medium text-[#333]">{account.bank}</p>
                    <p className="text-sm text-[#666]">
                      Ag: {account.agency} • CC: {account.account}
                    </p>
                    <p className="text-sm text-[#666]">{account.type}</p>
                    {account.default && (
                      <span className="inline-flex items-center gap-1 text-xs text-[#5cb85c] mt-1">
                        <CheckCircle className="w-3 h-3" />
                        Principal
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!account.default && (
                    <button
                      onClick={() => setDefault(account.id)}
                      className="text-sm text-[#00a8cc] hover:text-[#0088aa] px-3 py-1"
                    >
                      Tornar principal
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="text-[#d9534f] hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {accounts.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-[#666]">Nenhuma conta bancária cadastrada.</p>
          </div>
        )}
      </div>
    </div>
  );
}
