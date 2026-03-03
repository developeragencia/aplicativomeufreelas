"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FreelancerCard, { Freelancer } from "@/components/FreelancerCard";

const categories = [
  "Todas as areas",
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

const mockFreelancers: Freelancer[] = [
  {
    id: "rafael-jenei",
    name: "Rafael Pires Jenei",
    avatar: "https://ext.same-assets.com/2120427335/1631370877.jpeg",
    title: "Publicitario Criativo",
    rating: 4.82,
    reviews: 1539,
    ranking: 1,
    projectsCompleted: 1542,
    recommendations: 1482,
    registeredSince: "17/10/2018",
    description: "Cansado da mesmice de sempre? Da mesma velha publicidade em todo canto? De textos sempre iguais, que qualquer pessoa le por ai? Seja bem-vindo, me chamo Rafael e busco ha 5 anos surpreender todos os clientes em todas areas em que trabalho: redacao, criacao, planejamento, edicao de audio e video.",
    skills: ["Adobe Premiere", "Animacao", "Criacao de Campanhas", "Criacao de Personagens"],
    isPremium: true,
    isVerified: true,
    isTopFreelancer: true,
  },
  {
    id: "bruno-quintino",
    name: "Bruno Quintino",
    avatar: "https://ext.same-assets.com/2120427335/28885143.jpeg",
    title: "Especialista em Logo/Identidade Visual",
    rating: 4.89,
    reviews: 546,
    ranking: 2,
    projectsCompleted: 529,
    recommendations: 534,
    registeredSince: "26/07/2016",
    description: "Tive meu primeiro contato com o design em 2010, onde tive oportunidade de trabalhar em um jornal impresso, executando tarefas de diagramacao de arte final, passei por algumas graficas e empresas de comunicacao visual no decorrer dos anos.",
    skills: ["Arte-Final", "Blender 3D", "Corel Draw", "Design 3D"],
    isPremium: true,
    isVerified: true,
    isTopFreelancer: true,
  },
  {
    id: "daniel-neves",
    name: "Daniel Neves",
    avatar: "https://ext.same-assets.com/2120427335/3051219835.jpeg",
    title: "Brand Designer | Especialista em Logotipos e Identidade Visual",
    rating: 4.9,
    reviews: 325,
    ranking: 3,
    projectsCompleted: 323,
    recommendations: 322,
    registeredSince: "09/01/2021",
    description: "Desde 2018, atuo no mercado de design grafico, acumulando experiencias em algumas das mais renomadas agencias de publicidade do Brasil. Minha trajetoria me proporcionou uma solida expertise em areas fundamentais para construcao de marcas.",
    skills: ["Adobe Premiere", "Adobe Photoshop", "Adobe Photoshop CS5", "Sony Vegas"],
    isPremium: true,
    isVerified: true,
    isTopFreelancer: true,
  },
  {
    id: "dickinson-dwizard",
    name: "Dickinson Dwizard",
    avatar: "https://ext.same-assets.com/2120427335/1752904728.jpeg",
    title: "Designer & Marketing",
    rating: 4.94,
    reviews: 513,
    ranking: 4,
    projectsCompleted: 509,
    recommendations: 511,
    registeredSince: "01/05/2018",
    description: "Somos Especialistas em Logomarcas, Identidade Visual, Rotulos e Embalagens. Consultoria e Registro no INPI. Criamos Sites, landingpages, Trafego Pago e tudo o que voce precisar.",
    skills: ["Corel Draw", "Adobe Photoshop", "Design de Cartao de Visita", "Comunicacao Visual"],
    isPremium: true,
    isVerified: true,
    isTopFreelancer: true,
  },
  {
    id: "giacomo-trezza",
    name: "Giacomo Silvestre De Abreu Trezza",
    avatar: "https://ext.same-assets.com/2120427335/539674227.jpeg",
    title: "Publicitario",
    rating: 4.88,
    reviews: 290,
    ranking: 8,
    projectsCompleted: 282,
    recommendations: 284,
    registeredSince: "09/07/2020",
    description: "Sou Giacomo Trezza, um profissional de marketing com oito anos de experiencia na industria. Ao longo dos anos, tenho me dedicado a aprimorar minhas habilidades em diversas areas.",
    skills: ["Design de Blogs", "Design de Logotipo", "Design de Website", "Adobe Photoshop"],
    isPremium: true,
    isVerified: true,
    isTopFreelancer: true,
  },
];

export default function FreelancersPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todas as areas");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-light text-gray-800">Resultado da pesquisa</h1>
              <p className="text-gray-600">2123905 freelancers foram encontrados</p>
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
              <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-20">
                {/* Search */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Palavras-chaves</h3>
                  <div className="flex">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ex. Web Designer, Redi"
                      className="flex-1 border border-gray-300 rounded-l px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1bafe1]"
                    />
                    <button className="bg-[#1bafe1] text-white px-3 py-2 rounded-r">
                      Ok
                    </button>
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Areas de interesse</h3>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          onClick={() => setSelectedCategory(category)}
                          className={`text-sm ${
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

                {/* Ranking Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Ranking</h3>
                  <ul className="space-y-2 text-sm">
                    <li><button className="text-[#1bafe1]">Qualquer ranking</button></li>
                    <li><button className="text-gray-600 hover:text-[#1bafe1]">5 estrelas</button></li>
                    <li><button className="text-gray-600 hover:text-[#1bafe1]">Pelo menos 4.5 estrelas</button></li>
                    <li><button className="text-gray-600 hover:text-[#1bafe1]">Pelo menos 4 estrelas</button></li>
                    <li><button className="text-gray-600 hover:text-[#1bafe1]">Sem feedback</button></li>
                  </ul>
                </div>

                {/* Recommendations Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Quantidade de recomendacoes</h3>
                  <ul className="space-y-2 text-sm">
                    <li><button className="text-[#1bafe1]">Qualquer quantidade</button></li>
                    <li><button className="text-gray-600 hover:text-[#1bafe1]">Pelo menos 5</button></li>
                    <li><button className="text-gray-600 hover:text-[#1bafe1]">Pelo menos 10</button></li>
                    <li><button className="text-gray-600 hover:text-[#1bafe1]">Pelo menos 15</button></li>
                  </ul>
                </div>

                {/* Reset Button */}
                <button className="w-full bg-[#1bafe1] text-white py-2 rounded font-medium hover:bg-[#2595cb] transition-colors">
                  Resetar Filtros
                </button>
              </div>
            </aside>

            {/* Freelancer List */}
            <div className="flex-1">
              {/* Sort and Pagination */}
              <div className="flex items-center justify-between mb-4">
                <select className="border border-gray-300 rounded px-3 py-2 text-sm">
                  <option>Relevancia</option>
                  <option>Ranking</option>
                  <option>Projetos concluidos</option>
                  <option>Avaliacao</option>
                </select>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 bg-[#1bafe1] text-white rounded">1</button>
                  <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50">2</button>
                  <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50">3</button>
                  <span className="text-gray-400">...</span>
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                    Ultima
                  </button>
                </div>
              </div>

              {/* Freelancer Cards */}
              <div className="space-y-4">
                {mockFreelancers.map((freelancer) => (
                  <FreelancerCard key={freelancer.id} freelancer={freelancer} />
                ))}
              </div>

              {/* Bottom Pagination */}
              <div className="flex items-center justify-center gap-2 mt-8">
                <button className="w-8 h-8 bg-[#1bafe1] text-white rounded">1</button>
                <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50">2</button>
                <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50">3</button>
                <span className="text-gray-400">...</span>
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
