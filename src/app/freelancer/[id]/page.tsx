/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";

const mockFreelancers = [
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

const badges = [
  { icon: "https://ext.same-assets.com/2120427335/248523270.png", title: "Badge 1" },
  { icon: "https://ext.same-assets.com/2120427335/1590215995.png", title: "Badge 2" },
];

export default function FreelancerProfilePage() {
  const params = useParams();
  const [freelancer, setFreelancer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      // Simulate fetch or find in mock
      const found = mockFreelancers.find(f => f.id === params.id);
      if (found) {
        setFreelancer(found);
      }
      setLoading(false);
    }
  }, [params.id]);

  if (loading) return <div className="flex justify-center p-10">Carregando...</div>;
  if (!freelancer) return <div className="flex justify-center p-10">Freelancer não encontrado</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Secondary Nav */}
      <nav className="bg-[#1bafe1] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 py-2 overflow-x-auto">
            <Link href="/" className="text-sm hover:underline whitespace-nowrap">Pagina inicial</Link>
            <Link href="/projetos" className="text-sm hover:underline whitespace-nowrap">Projetos</Link>
            <Link href="/freelancers" className="text-sm hover:underline whitespace-nowrap">Freelancers</Link>
            <Link href="#" className="text-sm hover:underline whitespace-nowrap">Perfil</Link>
            <Link href="#" className="text-sm hover:underline whitespace-nowrap">Conta</Link>
            <Link href="#" className="text-sm hover:underline whitespace-nowrap">Ferramentas</Link>
            <Link href="#" className="text-sm hover:underline whitespace-nowrap">Ajuda</Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <Link href="/freelancers" className="text-[#1bafe1] hover:underline text-sm">
              Voltar aos resultados da pesquisa
            </Link>
          </div>

          {/* Profile Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="relative w-48 h-48 rounded overflow-hidden">
                  <Image
                    src={freelancer.avatar}
                    alt={freelancer.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    {/* Name and badges */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {freelancer.isPremium && (
                        <Image
                          src="https://ext.same-assets.com/2120427335/253051279.png"
                          alt="Premium"
                          width={24}
                          height={24}
                          className="premium-badge"
                        />
                      )}
                      <h1 className="text-2xl font-semibold text-gray-800">
                        {freelancer.name}
                      </h1>
                      {freelancer.isVerified && (
                        <Image
                          src="https://ext.same-assets.com/2120427335/333311740.png"
                          alt="Verificado"
                          width={20}
                          height={20}
                        />
                      )}
                      {freelancer.isTopFreelancer && (
                        <span className="bg-[#1bafe1] text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Image
                            src="https://ext.same-assets.com/2120427335/2296782752.svg"
                            alt="Top"
                            width={12}
                            height={12}
                          />
                          TOP FREELANCER PLUS
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg text-gray-600 mb-2">{freelancer.title}</h2>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <StarRating rating={freelancer.rating} />
                      <span className="text-gray-500 text-sm">
                        ({freelancer.reviews} avaliações)
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-semibold block">{freelancer.ranking}º</span>
                        <span className="text-xs">Ranking</span>
                      </div>
                      <div>
                        <span className="font-semibold block">{freelancer.projectsCompleted}</span>
                        <span className="text-xs">Projetos concluidos</span>
                      </div>
                      <div>
                        <span className="font-semibold block">{freelancer.recommendations}</span>
                        <span className="text-xs">Recomendacoes</span>
                      </div>
                      <div>
                        <span className="font-semibold block">{freelancer.registeredSince}</span>
                        <span className="text-xs">Na plataforma desde</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                     {badges.map((badge, index) => (
                        <Image 
                          key={index} 
                          src={badge.icon} 
                          alt={badge.title} 
                          width={40} 
                          height={40} 
                          title={badge.title}
                        />
                     ))}
                  </div>
                </div>

                <hr className="my-6 border-gray-100" />

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Sobre mim</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {freelancer.description}
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Habilidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {freelancer.skills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
