import { useState } from 'react';
import { MapPin, Save, Globe, Building, Home } from 'lucide-react';

export default function InformacoesLocalizacao() {
  const [address, setAddress] = useState({
    street: 'Rua Example, 123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01000-000',
    country: 'Brasil',
  });

  return (
    <div className="max-w-[800px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Informações de Localização</h1>
      
      <div className="bg-white rounded shadow-sm p-6">
        {/* Info */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded mb-6">
          <MapPin className="w-5 h-5 text-[#00a8cc]" />
          <p className="text-sm text-[#666]">
            Suas informações de localização são usadas para calcular taxas e mostrar projetos próximos.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#333] mb-2 flex items-center gap-2">
              <Home className="w-4 h-4" />
              Endereço
            </label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">
                Bairro
              </label>
              <input
                type="text"
                value={address.neighborhood}
                onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">
                CEP
              </label>
              <input
                type="text"
                value={address.zipCode}
                onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#333] mb-2 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Cidade
              </label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">
                Estado
              </label>
              <select
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc] bg-white"
              >
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333] mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              País
            </label>
            <select
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
              className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc] bg-white"
            >
              <option>Brasil</option>
              <option>Portugal</option>
              <option>Estados Unidos</option>
              <option>Argentina</option>
              <option>Chile</option>
              <option>Colômbia</option>
              <option>México</option>
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-[#333] mb-2">
              Fuso Horário
            </label>
            <select className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc] bg-white">
              <option>(GMT-03:00) Brasília</option>
              <option>(GMT-04:00) Manaus</option>
              <option>(GMT-02:00) Fernando de Noronha</option>
            </select>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-[#00a8cc] hover:bg-[#0088aa] text-white font-medium rounded transition-colors duration-200">
              <Save className="w-5 h-5" />
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
