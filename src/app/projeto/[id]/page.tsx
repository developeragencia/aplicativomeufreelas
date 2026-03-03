"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_min: string;
  budget_max: string;
  deadline: string;
  status: string;
  proposals_count: number;
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects.php?id=${params.id}`)
        .then(res => res.json())
        .then(data => {
          // API returns list, find matching id
          const found = Array.isArray(data) ? data.find((p: any) => p.id == params.id) : data;
          setProject(found);
          setLoading(false);
        })
        .catch(err => {
          console.error("Erro ao carregar projeto", err);
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) return <div className="flex justify-center p-10">Carregando...</div>;
  if (!project) return <div className="flex justify-center p-10">Projeto não encontrado</div>;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    {project.title}
                  </h1>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium">
                    ABERTO
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                  <span>{project.category}</span>
                  <span>|</span>
                  <span>Publicado: Hoje</span>
                  <span>|</span>
                  <span className="text-red-600 font-medium">
                    Propostas: {project.proposals_count}
                  </span>
                </div>

                <div className="prose max-w-none text-gray-700 whitespace-pre-line mb-8">
                  {project.description}
                </div>

                {/* Attachments Placeholder */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">Anexos</h3>
                  <p className="text-sm text-gray-500 italic">Nenhum anexo disponivel.</p>
                </div>
              </div>

              {/* Proposals Section Placeholder */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Propostas ({project.proposals_count})
                </h2>
                <div className="text-center py-8 text-gray-500">
                  <p>As propostas são privadas para este projeto.</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
              {/* Actions */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-1">Orcamento estimado</p>
                  <p className="text-2xl font-bold text-gray-800">
                    R${project.budget_min} - R${project.budget_max}
                  </p>
                </div>

                <Link
                  href={`/projeto/${project.id}/enviar-proposta`}
                  className="block w-full bg-[#1bafe1] text-white text-center py-3 rounded font-medium hover:bg-[#2595cb] transition-colors mb-3"
                >
                  Enviar proposta
                </Link>
                
                <button className="block w-full border border-gray-300 text-gray-700 text-center py-2 rounded hover:bg-gray-50 transition-colors">
                  Salvar projeto
                </button>
              </div>

              {/* Client Info Placeholder */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Sobre o Cliente</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                    ?
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Cliente Verificado</p>
                    <StarRating rating={5} size="sm" />
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Membro desde: 2024</p>
                  <p>Projetos publicados: 1</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
  },
  {
    id: "7",
    freelancer: {
      name: "Adryan T.",
      avatar: "https://ext.same-assets.com/2120427335/312423857.jpeg",
      isPro: true,
      isPremium: false,
      rating: 5,
    },
    submittedAt: "1 dia atras",
    offer: "Privado",
    duration: "Privado",
  },
];

export default function ProjectDetailPage() {
  const [expandedProposals, setExpandedProposals] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex items-center justify-between">
            <Link href="/projetos" className="text-[#1bafe1] hover:underline text-sm">
              « Voltar aos resultados da pesquisa
            </Link>
            <Link
              href="/publicar-projeto"
              className="bg-[#1bafe1] text-white px-4 py-2 rounded text-sm hover:bg-[#2595cb] transition-colors"
            >
              Publique um projeto como este
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                {/* Title with badges */}
                <div className="flex items-start gap-2 mb-2">
                  <h1 className="text-2xl font-light text-gray-800">
                    Contratacao de desenvolvedor Odoo 19
                  </h1>
                  <div className="flex gap-1">
                    <Image
                      src="https://ext.same-assets.com/2120427335/1394465936.png"
                      alt="Destaque"
                      width={24}
                      height={24}
                    />
                    <svg className="w-6 h-6 text-[#f1b42a]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-6 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  28/02/2026 as 11:29
                </p>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-800 italic mb-3">
                    Descricao do Projeto:
                  </h2>
                  <div className="text-sm text-gray-700 space-y-4">
                    <p>
                      Estamos desenvolvendo o ERP da nossa empresa de artefatos de concreto
                      utilizando como base o Odoo 19 (Community ou Enterprise, a definir).
                    </p>
                    <p>
                      Repositorio oficial da versao utilizada:{" "}
                      <a href="https://github.com/odoo/odoo/tree/19.0" className="text-[#1bafe1] hover:underline">
                        https://github.com/odoo/odoo/tree/19.0
                      </a>
                    </p>
                    <p>
                      Precisamos contratar um desenvolvedor freelancer com experiencia
                      comprovada em Odoo para desenvolver modulos personalizados totalmente
                      integrados aos modulos nativos do sistema.
                    </p>

                    <h3 className="font-medium mt-4">Objetivo do projeto</h3>
                    <p>
                      Desenvolver modulos personalizados para: Faturamento e Nota Fiscal;
                      Compras; Financeiro; Controle de Saida de Materiais; Permutas;
                      Integracao bancaria (CNAB); Integracao com meios de pagamento (Pix e
                      cartao); Relatorios gerenciais completos; Controle multiempresa (SaaS).
                    </p>
                    <p>
                      Tudo deve estar 100% integrado ao plano de contas e aos modulos
                      nativos do Odoo, respeitando a arquitetura oficial da versao 19.
                    </p>

                    <h3 className="font-medium mt-4">Requisitos gerais obrigatorios</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Utilizar boas praticas oficiais do Odoo 19.</li>
                      <li>Modulos totalmente integrados com: Sales, Purchase, Accounting e Inventory.</li>
                      <li>Estrutura multiempresa (SaaS).</li>
                      <li>Codigo altamente seguro, otimizado e performatico.</li>
                      <li>Modulos devem estar prontos para envio ao servidor de producao.</li>
                    </ul>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-3">
                    Habilidades desejadas:
                  </h2>
                  <div className="flex gap-2">
                    <Link href="/projetos?q=odoo" className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-sm hover:bg-gray-200">
                      Odoo
                    </Link>
                    <Link href="/projetos?q=python" className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-sm hover:bg-gray-200">
                      Python
                    </Link>
                  </div>
                </div>

                {/* Client Activity */}
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-3">
                    Atividades do cliente nesse projeto:
                  </h2>
                  <p className="text-sm text-gray-600">
                    <strong>Ultima visualizacao:</strong> ontem as 20:08
                  </p>
                </div>

                {/* Proposals Section */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setExpandedProposals(!expandedProposals)}
                      className="flex items-center gap-2 text-gray-800"
                    >
                      <span className="font-medium">Propostas (33)</span>
                      <svg className={`w-5 h-5 transition-transform ${expandedProposals ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                      <option>Todas</option>
                      <option>Premium</option>
                      <option>Verificados</option>
                    </select>
                  </div>

                  <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">
                    {mockProposals.map((proposal, index) => (
                      <div
                        key={proposal.id}
                        className={`flex items-center gap-4 p-4 ${index !== mockProposals.length - 1 ? 'border-b border-gray-200' : ''}`}
                      >
                        <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={proposal.freelancer.avatar}
                            alt={proposal.freelancer.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {proposal.freelancer.isPremium && (
                              <Image
                                src="https://ext.same-assets.com/2120427335/1678418548.png"
                                alt="Premium"
                                width={16}
                                height={16}
                              />
                            )}
                            {proposal.freelancer.isPro && (
                              <Image
                                src="https://ext.same-assets.com/2120427335/3431758708.png"
                                alt="Pro"
                                width={16}
                                height={16}
                              />
                            )}
                            <Link
                              href={`/freelancer/${proposal.id}`}
                              className="text-[#1bafe1] font-medium hover:underline"
                            >
                              {proposal.freelancer.name}
                            </Link>
                            {proposal.freelancer.isVerified && (
                              <Image
                                src="https://ext.same-assets.com/2120427335/1357920414.png"
                                alt="Verificado"
                                width={14}
                                height={14}
                              />
                            )}
                            {proposal.freelancer.isNew && (
                              <span className="bg-[#2eadaa] text-white text-xs px-2 py-0.5 rounded">
                                Freelancer novo
                              </span>
                            )}
                          </div>
                          <div className="flex items-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Image
                                key={star}
                                src={proposal.freelancer.rating > 0 && star <= Math.round(proposal.freelancer.rating)
                                  ? "https://ext.same-assets.com/2120427335/1250291283.png"
                                  : "https://ext.same-assets.com/2120427335/2591919119.png"
                                }
                                alt="star"
                                width={14}
                                height={14}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            Submetido: <strong>{proposal.submittedAt}</strong> |{" "}
                            Oferta: <strong>{proposal.offer}</strong> |{" "}
                            Duracao estimada: <strong>{proposal.duration}</strong>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full text-center text-[#1bafe1] py-3 hover:underline text-sm mt-2">
                    + 26 propostas
                  </button>
                </div>

                {/* Similar Projects */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <button className="flex items-center justify-between w-full text-left">
                    <span className="font-medium text-gray-800">Projetos semelhantes no 99Freelas</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
                <p className="text-center text-gray-600 mb-4">
                  Tem duvidas?{" "}
                  <Link href="#" className="text-[#1bafe1] font-medium hover:underline">
                    Faca uma pergunta
                  </Link>
                  .
                </p>

                <div className="text-center text-gray-400 mb-4">ou</div>

                <Link
                  href="/projeto/contratacao-desenvolvedor-odoo-19/enviar-proposta"
                  className="block w-full bg-[#1bafe1] text-white py-3 rounded font-medium hover:bg-[#2595cb] transition-colors text-center mb-6"
                >
                  Enviar proposta
                </Link>

                {/* Additional Info */}
                <div className="space-y-3 text-sm border-t border-gray-200 pt-4">
                  <h3 className="font-medium text-gray-800 mb-2">Informacoes adicionais</h3>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categoria:</span>
                    <span className="text-gray-800 text-right">Web, Mobile & Software</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subcategoria:</span>
                    <span className="text-gray-800 text-right">Desenvolvimento Web</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Orcamento:</span>
                    <span className="text-gray-800">Aberto</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nivel de experiencia:</span>
                    <span className="text-gray-800">Intermediario</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Visibilidade:</span>
                    <span className="text-gray-800">Publico</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Propostas:</span>
                    <span className="text-gray-800">33</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interessados:</span>
                    <span className="text-gray-800">41</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tempo restante:</span>
                    <span className="text-gray-800">12 dias e 7 horas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor Minimo:</span>
                    <span className="text-gray-800">R$50,00</span>
                  </div>
                </div>

                {/* Client Info */}
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <h3 className="font-medium text-gray-800 mb-3">Cliente</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded overflow-hidden">
                      <Image
                        src="https://ext.same-assets.com/2120427335/166071330.jpeg"
                        alt="Anderson M."
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link href="#" className="text-[#1bafe1] hover:underline font-medium">
                        Anderson M.
                      </Link>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Image
                            key={star}
                            src="https://ext.same-assets.com/2120427335/2591919119.png"
                            alt="star"
                            width={14}
                            height={14}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
