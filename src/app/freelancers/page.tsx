"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FreelancerCard, { Freelancer } from "@/components/FreelancerCard";

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
    ranking: 5,
    projectsCompleted: 280,
    recommendations: 285,
    registeredSince: "10/02/2019",
    description: "Publicitario com experiencia em midias sociais e campanhas digitais.",
    skills: ["Marketing Digital", "Facebook Ads", "Google Ads"],
    isPremium: false,
    isVerified: true,
    isTopFreelancer: false,
  }
];

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>(mockFreelancers);
  const [categories, setCategories] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories.php`)
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar categorias", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="font-semibold text-gray-700 mb-3">Categorias</h3>
              <ul className="space-y-2">
                {categories.map((cat, index) => (
                  <li key={index}>
                    <Link
                      href="#"
                      className="text-sm text-gray-600 hover:text-[#1bafe1] block py-1"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Freelancers List */}
          <div className="flex-grow">
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-10">Carregando freelancers...</div>
              ) : (
                freelancers.map((freelancer) => (
                  <FreelancerCard key={freelancer.id} freelancer={freelancer} />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}