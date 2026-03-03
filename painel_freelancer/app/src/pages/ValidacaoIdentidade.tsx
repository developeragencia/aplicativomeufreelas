import { CheckCircle, Upload, Shield, AlertCircle } from 'lucide-react';

export default function ValidacaoIdentidade() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Validação de Identidade</h1>
      
      <div className="bg-white rounded shadow-sm p-6">
        {/* Status */}
        <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded mb-6">
          <AlertCircle className="w-6 h-6 text-yellow-600" />
          <div>
            <p className="font-medium text-yellow-800">Validação Pendente</p>
            <p className="text-sm text-yellow-700">
              Complete a validação para aumentar sua credibilidade na plataforma.
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#333] mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00a8cc]" />
            Benefícios da Validação
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded text-center">
              <CheckCircle className="w-8 h-8 text-[#5cb85c] mx-auto mb-2" />
              <p className="text-sm font-medium text-[#333]">Selo de Verificado</p>
              <p className="text-xs text-[#666]">Destaque-se dos outros freelancers</p>
            </div>
            <div className="p-4 bg-gray-50 rounded text-center">
              <CheckCircle className="w-8 h-8 text-[#5cb85c] mx-auto mb-2" />
              <p className="text-sm font-medium text-[#333]">Mais Confiança</p>
              <p className="text-xs text-[#666]">Clientes confiam mais em perfis validados</p>
            </div>
            <div className="p-4 bg-gray-50 rounded text-center">
              <CheckCircle className="w-8 h-8 text-[#5cb85c] mx-auto mb-2" />
              <p className="text-sm font-medium text-[#333]">Prioridade</p>
              <p className="text-xs text-[#666]">Apareça primeiro nas buscas</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-semibold text-[#333] mb-3">
              Documento de Identidade (RG ou CNH)
            </h3>
            <div className="border-2 border-dashed border-[#ddd] rounded p-8 text-center hover:border-[#00a8cc] transition-colors duration-200 cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-[#666] mb-2">Arraste e solte ou clique para fazer upload</p>
              <p className="text-sm text-[#999]">PNG, JPG ou PDF (máx. 5MB)</p>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#333] mb-3">
              Comprovante de Residência
            </h3>
            <div className="border-2 border-dashed border-[#ddd] rounded p-8 text-center hover:border-[#00a8cc] transition-colors duration-200 cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-[#666] mb-2">Arraste e solte ou clique para fazer upload</p>
              <p className="text-sm text-[#999]">PNG, JPG ou PDF (máx. 5MB)</p>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#333] mb-3">
              Selfie com Documento
            </h3>
            <div className="border-2 border-dashed border-[#ddd] rounded p-8 text-center hover:border-[#00a8cc] transition-colors duration-200 cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-[#666] mb-2">Arraste e solte ou clique para fazer upload</p>
              <p className="text-sm text-[#999]">PNG ou JPG (máx. 5MB)</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8 pt-6 border-t border-[#e0e0e0]">
          <button className="px-6 py-3 bg-[#00a8cc] hover:bg-[#0088aa] text-white font-medium rounded transition-colors duration-200">
            Enviar para Validação
          </button>
        </div>
      </div>
    </div>
  );
}
