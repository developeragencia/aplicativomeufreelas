import { useState } from 'react';
import { Lock, Eye, EyeOff, Save, Shield, Smartphone } from 'lucide-react';

export default function ConfiguracoesAcesso() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="max-w-[800px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Configurações de Acesso</h1>
      
      <div className="space-y-6">
        {/* Change Password */}
        <div className="bg-white rounded shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#333] mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#00a8cc]" />
            Alterar Senha
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">
                Senha Atual
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc] pr-12"
                />
                <button
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc] pr-12"
                />
                <button
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc] pr-12"
                />
                <button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button className="flex items-center gap-2 px-6 py-3 bg-[#00a8cc] hover:bg-[#0088aa] text-white font-medium rounded transition-colors duration-200">
              <Save className="w-5 h-5" />
              Alterar Senha
            </button>
          </div>
        </div>

        {/* Two Factor Authentication */}
        <div className="bg-white rounded shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#333] mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00a8cc]" />
            Autenticação de Dois Fatores
          </h2>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#00a8cc] rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-[#333]">Autenticação por SMS</p>
                <p className="text-sm text-[#666]">
                  {twoFactor ? 'Ativado' : 'Desativado'}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a8cc]"></div>
            </label>
          </div>
        </div>

        {/* Login Sessions */}
        <div className="bg-white rounded shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#333] mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#00a8cc]" />
            Sessões Ativas
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
              <div>
                <p className="font-medium text-[#333]">Chrome - Windows</p>
                <p className="text-sm text-[#666]">São Paulo, Brasil • Atual</p>
              </div>
              <span className="text-xs text-green-600 font-medium px-2 py-1 bg-green-100 rounded">
                Ativo agora
              </span>
            </div>
            <div className="flex items-center justify-between p-3 border border-[#e0e0e0] rounded">
              <div>
                <p className="font-medium text-[#333]">Safari - iPhone</p>
                <p className="text-sm text-[#666]">São Paulo, Brasil • 2 dias atrás</p>
              </div>
              <button className="text-sm text-[#d9534f] hover:text-red-700">
                Encerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
