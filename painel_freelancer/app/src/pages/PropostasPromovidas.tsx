import { Rocket, Star, DollarSign, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';

interface PromotedProposal {
  id: number;
  project: string;
  client: string;
  value: number;
  status: 'ativa' | 'expirada' | 'aceita';
  startDate: string;
  endDate: string;
  views: number;
  clicks: number;
}

export default function PropostasPromovidas() {
  const [proposals] = useState<PromotedProposal[]>([
    {
      id: 1,
      project: 'Desenvolvimento de E-commerce',
      client: 'Loja Virtual Ltda',
      value: 5000,
      status: 'ativa',
      startDate: '15/01/2024',
      endDate: '22/01/2024',
      views: 45,
      clicks: 8,
    },
    {
      id: 2,
      project: 'Design de Identidade Visual',
      client: 'Startup Tech',
      value: 2500,
      status: 'aceita',
      startDate: '01/01/2024',
      endDate: '08/01/2024',
      views: 62,
      clicks: 15,
    },
    {
      id: 3,
      project: 'Redação de Conteúdo SEO',
      client: 'Agência Digital',
      value: 1200,
      status: 'expirada',
      startDate: '10/12/2023',
      endDate: '17/12/2023',
      views: 28,
      clicks: 3,
    },
  ]);

  const stats = {
    total: proposals.length,
    ativas: proposals.filter(p => p.status === 'ativa').length,
    aceitas: proposals.filter(p => p.status === 'aceita').length,
    totalInvestido: proposals.reduce((acc, p) => acc + (p.status === 'ativa' ? 29.90 : 0), 0),
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Propostas Promovidas</h1>
      
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-[#00a8cc] to-[#0088aa] rounded p-6 mb-8 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Destaque suas propostas</h2>
            <p className="text-white/90">
              As propostas promovidas aparecem no topo da lista do cliente, 
              aumentando suas chances de ser contratado em até 3x.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded shadow-sm p-4">
          <p className="text-sm text-[#666] mb-1">Total de Promoções</p>
          <p className="text-2xl font-bold text-[#333]">{stats.total}</p>
        </div>
        <div className="bg-white rounded shadow-sm p-4">
          <p className="text-sm text-[#666] mb-1">Promoções Ativas</p>
          <p className="text-2xl font-bold text-[#00a8cc]">{stats.ativas}</p>
        </div>
        <div className="bg-white rounded shadow-sm p-4">
          <p className="text-sm text-[#666] mb-1">Propostas Aceitas</p>
          <p className="text-2xl font-bold text-[#5cb85c]">{stats.aceitas}</p>
        </div>
        <div className="bg-white rounded shadow-sm p-4">
          <p className="text-sm text-[#666] mb-1">Investimento Atual</p>
          <p className="text-2xl font-bold text-[#ff9800]">
            R$ {stats.totalInvestido.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-[#333] mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-[#00a8cc]" />
          Preço da Promoção
        </h2>
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded">
          <div className="text-3xl font-bold text-[#00a8cc]">R$ 29,90</div>
          <div className="text-[#666]">
            <p className="font-medium">por proposta promovida</p>
            <p className="text-sm">Duração: 7 dias ou até a proposta ser aceita</p>
          </div>
        </div>
      </div>

      {/* Promoted Proposals List */}
      <div className="bg-white rounded shadow-sm">
        <div className="flex items-center gap-3 p-4 border-b border-[#e0e0e0] bg-gray-50">
          <Rocket className="w-5 h-5 text-[#00a8cc]" />
          <span className="font-medium text-[#333]">Minhas propostas promovidas</span>
        </div>

        {proposals.length > 0 ? (
          <div className="divide-y divide-[#e0e0e0]">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[#333]">{proposal.project}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        proposal.status === 'ativa'
                          ? 'bg-green-100 text-green-700'
                          : proposal.status === 'aceita'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {proposal.status === 'ativa' ? 'Ativa' : 
                         proposal.status === 'aceita' ? 'Aceita' : 'Expirada'}
                      </span>
                    </div>
                    <p className="text-sm text-[#666] mb-2">Cliente: {proposal.client}</p>
                    <p className="text-sm text-[#00a8cc] font-medium mb-2">
                      Valor da proposta: R$ {proposal.value.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-[#666]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {proposal.startDate} - {proposal.endDate}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-lg font-bold text-[#333]">{proposal.views}</p>
                        <p className="text-xs text-[#666]">Visualizações</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-lg font-bold text-[#333]">{proposal.clicks}</p>
                        <p className="text-xs text-[#666]">Cliques</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Rocket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-[#666]">Nenhuma proposta promovida ainda.</p>
            <p className="text-sm text-[#999]">Promova suas propostas para aumentar suas chances!</p>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded shadow-sm p-6 text-center">
          <TrendingUp className="w-10 h-10 text-[#00a8cc] mx-auto mb-3" />
          <h3 className="font-semibold text-[#333] mb-2">3x mais visualizações</h3>
          <p className="text-sm text-[#666]">Propostas promovidas recebem muito mais atenção dos clientes</p>
        </div>
        <div className="bg-white rounded shadow-sm p-6 text-center">
          <Star className="w-10 h-10 text-[#ff9800] mx-auto mb-3" />
          <h3 className="font-semibold text-[#333] mb-2">Destaque especial</h3>
          <p className="text-sm text-[#666]">Sua proposta aparece com badge de destaque no topo</p>
        </div>
        <div className="bg-white rounded shadow-sm p-6 text-center">
          <CheckCircle className="w-10 h-10 text-[#5cb85c] mx-auto mb-3" />
          <h3 className="font-semibold text-[#333] mb-2">Maior taxa de aceite</h3>
          <p className="text-sm text-[#666]">Freelancers que promovem propostas têm 40% mais chances</p>
        </div>
      </div>
    </div>
  );
}
