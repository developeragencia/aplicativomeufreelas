"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";

const categories = [
  "Todas as categorias",
  "Administracao & Contabilidade",
  "Advogados & Leis",
  "Atendimento ao Consumidor",
  "Design & Criacao",
  "Educacao & Consultoria",
  "Engenharia & Arquitetura",
  "Escrita",
  "Fotografia & AudioVisual",
  "Suporte Administrativo",
  "Traducao",
  "Vendas & Marketing",
  "Web, Mobile & Software",
];

interface Project {
  id: string;
  title: string;
  category: string;
  level: string;
  publishedAt: string;
  timeRemaining: string;
  proposals: number;
  interested: number;
  description: string;
  skills?: string[];
  client: {
    name: string;
    rating: number;
    reviews: number;
  };
  isFeatured?: boolean;
}

const mockProjects: Project[] = [
  {
    id: "otimizacao-google-meu-negocio-732690",
    title: "Otimizacao e gestao do perfil no Google Meu Negocio",
    category: "Marketing Digital",
    level: "Intermediario",
    publishedAt: "1 dia atras",
    timeRemaining: "28 dias e 7 horas",
    proposals: 45,
    interested: 48,
    description: "Caros, gostaria de receber orcamentos de profissionais com experiencia comprovada em otimizacao e gestao do perfil no Google Meu Negocio, de modo que minha pagina apareca entre as primeiras na pesquisa do Google.\n\nSegue link da minha pagina: https://share.google/i3PtDzfH8DXMAo7vQ\n\nDesde ja agradeco aos interessados.",
    client: { name: "Victor S.", rating: 4.5, reviews: 3 },
    isFeatured: true,
  },
  {
    id: "implantacao-bitrix24-sum-732641",
    title: "Implantacao Bitrix24 - Sum",
    category: "Marketing Digital",
    level: "Especialista",
    publishedAt: "1 dia atras",
    timeRemaining: "5 dias e 4 horas",
    proposals: 9,
    interested: 13,
    description: "Implantacao do Bitrix24 para a Sum.\n\n• Configuracao do CRM completo, incluindo funis de vendas e base de clientes.\n• Criacao de base de precos e de produtos/servicos para geracao automatica de orcamentos.\n• Automacao de processos, incluindo calculos de impostos, descontos e fluxos de trabalho internos.",
    skills: ["CRM"],
    client: { name: "Felipe M.", rating: 0, reviews: 0 },
    isFeatured: true,
  },
  {
    id: "logotipo-empresa-estofos-733192",
    title: "Titulo: Preciso de um logotipo para a minha empresa de estofos",
    category: "Logotipos",
    level: "Iniciante",
    publishedAt: "12 minutos atras",
    timeRemaining: "29 dias e 23 horas",
    proposals: 0,
    interested: 0,
    description: "Procuro um designer grafico criativo para criar um logotipo profissional para a minha empresa de estofos. O logotipo deve ser limpo, exclusivo e adequado para branding e marketing.\n\nPor favor, envie o seu portfolio e o prazo de entrega estimado.",
    client: { name: "", rating: 0, reviews: 0 },
    isFeatured: true,
  },
  {
    id: "designer-grafico-projetos-visuais-733191",
    title: "Precisa-se de designer grafico criativo para projetos visuais profissionais",
    category: "Logotipos",
    level: "Iniciante",
    publishedAt: "15 minutos atras",
    timeRemaining: "29 dias e 23 horas",
    proposals: 0,
    interested: 0,
    description: "Designer Grafico Criativo Necessario para Projetos Visuais Profissionais\n\nDescricao\nBusco um designer grafico talentoso e criativo para criar designs visuais de alta qualidade para minha marca. Este projeto exige alguem com um olhar apurado para detalhes e a capacidade de transformar ideias em designs modernos, limpos e profissionais.",
    client: { name: "", rating: 0, reviews: 0 },
    isFeatured: true,
  },
  {
    id: "loja-shopify-camisetas-733188",
    title: "Criar loja shopify em tema de camisetas de time",
    category: "Vendas & Marketing",
    level: "Iniciante",
    publishedAt: "1 hora atras",
    timeRemaining: "2 dias e 22 horas",
    proposals: 1,
    interested: 2,
    description: "Seria uma loja clone na qual ja tenho o modelo e tudo certo, so copiar layout banner e configurar certinho. Seria uma loja na shopify mesmo..\nalgo simples pra quem sabe\ntenho urgencia no projeto",
    client: { name: "", rating: 0, reviews: 0 },
    isFeatured: true,
  },
  {
    id: "ebooks-biblicos-colorir-733182",
    title: "Criacao de ebooks biblicos para colorir",
    category: "Escrita & Conteudo",
    level: "Intermediario",
    publishedAt: "2 horas atras",
    timeRemaining: "29 dias e 21 horas",
    proposals: 1,
    interested: 2,
    description: "JA TENHO UM PRE-PROJETO PARA SER REFORMULADO URGENTE.\n\nQuero iniciar as vendas antes da Pascoa.\n\nDesejo reformular um material criado com ia. Sao livros de colorir biblicos para alfabetizar, colorir e aprender sobre a vida de Jesus.\nUma opcao para vender na Pascoa",
    client: { name: "", rating: 0, reviews: 0 },
    isFeatured: true,
  },
];

export default function ProjetosPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todas as categorias");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-light text-gray-800">Resultado da pesquisa</h1>
              <p className="text-gray-600">1721 projetos foram encontrados</p>
            </div>
            <Link
              href="/publicar-projeto"
              className="bg-[#1bafe1] text-white px-6 py-2 rounded font-medium hover:bg-[#2595cb] transition-colors text-center"
            >
              Publique um projeto. E gratis.
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                {/* Search */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Palavras-chaves</h3>
                  <div className="flex">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ex. HTML, CSS, JavaSc"
                      className="flex-1 border border-gray-300 rounded-l px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1bafe1]"
                    />
                    <button className="bg-[#1bafe1] text-white px-3 py-2 rounded-r">
                      Ok
                    </button>
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Categorias</h3>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          onClick={() => setSelectedCategory(category)}
                          className={`text-sm text-left w-full ${
                            selectedCategory === category
                              ? "text-[#1bafe1] font-medium"
                              : "text-gray-600 hover:text-[#1bafe1]"
                          }`}
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Project Type */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Tipo de projeto</h3>
                  <ul className="space-y-2 text-sm">
                    <li><button className="text-[#1bafe1]">Todos os projetos</button></li>
                    <li>
                      <label className="flex items-center gap-2 text-gray-600">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Projetos em destaque
                      </label>
                    </li>
                    <li>
                      <label className="flex items-center gap-2 text-gray-600">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Projetos urgentes
                      </label>
                    </li>
                  </ul>
                </div>

                {/* Publication Date */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Data da publicacao</h3>
                  <ul className="space-y-2 text-sm">
                    <li><button className="text-[#1bafe1]">Qualquer hora</button></li>
                    <li><button className="text-gray-600 hover:text-[#1bafe1]">Menos de 24 horas atras</button></li>
                    <li><button className="text-gray-600 hover:text-[#1bafe1]">Menos de 3 dias atras</button></li>
                  </ul>
                </div>

                {/* Ranking */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Ranking do cliente</h3>
                  <ul className="space-y-2 text-sm">
                    <li><button className="text-[#1bafe1]">Qualquer ranking</button></li>
                    <li><button className="text-gray-600 hover:text-[#1bafe1]">5 estrelas</button></li>
                    <li><button className="text-gray-600 hover:text-[#1bafe1]">Pelo menos 4.5 estrelas</button></li>
                    <li><button className="text-gray-600 hover:text-[#1bafe1]">Pelo menos 4 estrelas</button></li>
                    <li><button className="text-gray-600 hover:text-[#1bafe1]">Sem feedback</button></li>
                  </ul>
                </div>

                {/* Experience Level */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Nivel de experiencia</h3>
                  <ul className="space-y-2 text-sm">
                    <li><button className="text-[#1bafe1]">Todos os niveis de experiencia</button></li>
                    <li>
                      <label className="flex items-center gap-2 text-gray-600">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Iniciante
                      </label>
                    </li>
                    <li>
                      <label className="flex items-center gap-2 text-gray-600">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Intermediario
                      </label>
                    </li>
                    <li>
                      <label className="flex items-center gap-2 text-gray-600">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Especialista
                      </label>
                    </li>
                  </ul>
                </div>

                {/* Reset Button */}
                <button className="w-full bg-[#1bafe1] text-white py-2 rounded font-medium hover:bg-[#2595cb] transition-colors">
                  Resetar Filtros
                </button>
              </div>
            </aside>

            {/* Project List */}
            <div className="flex-1">
              {/* Sort and Pagination */}
              <div className="flex items-center justify-between mb-4">
                <select className="border border-gray-300 rounded px-3 py-2 text-sm">
                  <option>Relevancia</option>
                  <option>Data de publicacao</option>
                  <option>Propostas</option>
                </select>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 bg-[#1bafe1] text-white rounded text-sm">1</button>
                  <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 text-sm">2</button>
                  <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 text-sm">3</button>
                  <span className="text-gray-400 px-1">...</span>
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                    Ultima
                  </button>
                </div>
              </div>

              {/* Project Cards */}
              <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">
                {mockProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className={`bg-white p-5 relative ${index !== mockProjects.length - 1 ? 'border-b border-gray-200' : ''}`}
                  >
                    {/* Featured Star */}
                    {project.isFeatured && (
                      <div className="absolute top-4 right-4">
                        <svg className="w-8 h-8 text-[#f1b42a]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Title */}
                    <Link
                      href={`/projeto/${project.id}`}
                      className="text-[#1bafe1] font-medium text-lg hover:underline block mb-2 pr-12"
                    >
                      {project.title}
                    </Link>

                    {/* Meta Info */}
                    <p className="text-sm text-gray-600 mb-3">
                      {project.category} | {project.level} | Publicado: <strong>{project.publishedAt}</strong> |
                      Tempo restante: <strong>{project.timeRemaining}</strong> |
                      Propostas: <strong>{project.proposals}</strong> |
                      Interessados: <strong>{project.interested}</strong>
                    </p>

                    {/* Description */}
                    <p className="text-sm text-gray-700 mb-3 whitespace-pre-line line-clamp-4">
                      {project.description}
                    </p>

                    {/* Skills */}
                    {project.skills && project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.skills.map((skill) => (
                          <Link
                            key={skill}
                            href={`/projetos?q=${skill.toLowerCase()}`}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200 hover:bg-gray-200"
                          >
                            {skill}
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Client Info */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 font-medium">Cliente:</span>
                      {project.client.name ? (
                        <Link href="#" className="text-[#1bafe1] text-sm hover:underline">
                          {project.client.name}
                        </Link>
                      ) : null}
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Image
                            key={star}
                            src={project.client.reviews > 0 && star <= Math.round(project.client.rating)
                              ? "https://ext.same-assets.com/2120427335/2069117945.png"
                              : "https://ext.same-assets.com/2120427335/1639383837.png"
                            }
                            alt="star"
                            width={14}
                            height={14}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {project.client.reviews > 0
                          ? `(${project.client.reviews} avaliacoes)`
                          : "(Sem feedback)"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Pagination */}
              <div className="flex items-center justify-center gap-1 mt-8">
                <button className="w-8 h-8 bg-[#1bafe1] text-white rounded text-sm">1</button>
                <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 text-sm">2</button>
                <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 text-sm">3</button>
                <span className="text-gray-400 px-1">...</span>
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                  Ultima
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
