import { FileCheck, Upload, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';

const documents = [
  {
    id: 1,
    name: 'RG - Frente',
    type: 'identidade',
    status: 'aprovado',
    date: '15/01/2024',
  },
  {
    id: 2,
    name: 'RG - Verso',
    type: 'identidade',
    status: 'aprovado',
    date: '15/01/2024',
  },
  {
    id: 3,
    name: 'Comprovante de Residência',
    type: 'residencia',
    status: 'pendente',
    date: '20/01/2024',
  },
  {
    id: 4,
    name: 'Selfie com Documento',
    type: 'selfie',
    status: 'pendente',
    date: null,
  },
  {
    id: 5,
    name: 'Certificado de Empresa',
    type: 'empresa',
    status: 'nao_enviado',
    date: null,
  },
];

const requiredDocs = [
  { name: 'Documento de Identidade', description: 'RG ou CNH (frente e verso)' },
  { name: 'Comprovante de Residência', description: 'Conta de água, luz ou telefone (últimos 3 meses)' },
  { name: 'Selfie com Documento', description: 'Foto segurando o documento ao lado do rosto' },
];

export default function VerificacoesDocumentos() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Verificações de Documentos</h1>
      
      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-[#666]">Aprovados</p>
              <p className="text-2xl font-bold text-green-600">
                {documents.filter(d => d.status === 'aprovado').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-[#666]">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {documents.filter(d => d.status === 'pendente').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-[#666]">Não Enviados</p>
              <p className="text-2xl font-bold text-gray-600">
                {documents.filter(d => d.status === 'nao_enviado').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Required Documents */}
      <div className="bg-white rounded shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#333] mb-4 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-[#00a8cc]" />
          Documentos Necessários
        </h2>
        <div className="space-y-3">
          {requiredDocs.map((doc, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
              <div className="w-8 h-8 bg-[#00a8cc] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">{index + 1}</span>
              </div>
              <div>
                <p className="font-medium text-[#333]">{doc.name}</p>
                <p className="text-sm text-[#666]">{doc.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded shadow-sm">
        <div className="flex items-center gap-3 p-4 border-b border-[#e0e0e0] bg-gray-50">
          <FileText className="w-5 h-5 text-[#00a8cc]" />
          <span className="font-medium text-[#333]">Meus Documentos</span>
        </div>

        <div className="divide-y divide-[#e0e0e0]">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center gap-4">
                {/* Status Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  doc.status === 'aprovado' ? 'bg-green-100' :
                  doc.status === 'pendente' ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  {doc.status === 'aprovado' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : doc.status === 'pendente' ? (
                    <Clock className="w-5 h-5 text-yellow-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                {/* Info */}
                <div>
                  <p className="font-medium text-[#333]">{doc.name}</p>
                  {doc.date && (
                    <p className="text-xs text-[#999]">Enviado em {doc.date}</p>
                  )}
                </div>
              </div>

              {/* Status and Action */}
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded ${
                  doc.status === 'aprovado'
                    ? 'bg-green-100 text-green-700'
                    : doc.status === 'pendente'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {doc.status === 'aprovado' ? 'Aprovado' : 
                   doc.status === 'pendente' ? 'Pendente' : 'Não Enviado'}
                </span>
                <button className="flex items-center gap-1 px-3 py-2 bg-[#00a8cc] hover:bg-[#0088aa] text-white text-sm rounded transition-colors duration-200">
                  <Upload className="w-4 h-4" />
                  {doc.status === 'nao_enviado' ? 'Enviar' : 'Reenviar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
