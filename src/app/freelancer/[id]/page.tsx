"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";

const badges = [
  { icon: "https://ext.same-assets.com/2120427335/248523270.png", title: "Badge 1" },
  { icon: "https://ext.same-assets.com/2120427335/1590215995.png", title: "Badge 2" },
];

const skills = [
  "Adobe Premiere", "Animacao", "Criacao de Campanhas", "Criacao de Personagens",
  "Adobe After Effects", "Criacao", "Edicao", "Edicao de Fotografia",
  "Edicao de Imagens", "Edicao de Textos", "Adobe Illustrator", "Ilustracao",
  "Manipulacao de Imagens", "Adobe Photoshop", "Redacao", "Redacao Publicitaria",
];

export default function FreelancerProfilePage() {
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

                    {/* Title */}
                    <p className="text-gray-600 mb-2">{freelancer.title}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <StarRating rating={4.82} size="md" />
                      <span className="text-sm text-gray-500">(4.82 - 1538 avaliacoes)</span>
                    </div>

                    {/* Stats */}
                    <p className="text-sm text-gray-600 mb-4">
                      Ranking: <strong>{freelancer.ranking}</strong> |
                      Projetos concluidos: <strong>{freelancer.projectsCompleted}</strong> |
                      Recomendacoes: <strong>{freelancer.recommendations}</strong> |
                      Registrado desde: <strong>{freelancer.registeredSince}</strong>
                    </p>

                    {/* Badges */}
                    <div className="flex gap-2">
                      {badges.map((badge, index) => (
                        <Image
                          key={index}
                          src={badge.icon}
                          alt={badge.title}
                          width={32}
                          height={32}
                          className="rounded"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Report Button */}
                  <button className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors">
                    Denunciar
                  </button>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Sobre mim:</h2>
              <div className="text-gray-700 space-y-4">
                <p>{freelancer.description}</p>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Habilidades:</h2>
              <div className="flex flex-wrap gap-2">
                {freelancer.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded border border-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Portfolio:</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                  >
                    <span className="text-gray-400">Imagem {item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Avaliacoes recentes:
              </h2>
              <div className="space-y-4">
                {[1, 2, 3].map((review) => (
                  <div key={review} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <StarRating rating={5} size="sm" />
                      <span className="text-sm text-gray-500">ha 2 dias</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Excelente profissional! Entregou o projeto antes do prazo e
                      com qualidade excepcional. Recomendo muito!
                    </p>
                    <p className="text-sm text-[#1bafe1] mt-1">- Cliente Satisfeito</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="#"
                className="flex-1 bg-[#1bafe1] text-white py-3 rounded font-medium hover:bg-[#2595cb] transition-colors text-center"
              >
                Enviar Mensagem
              </Link>
              <Link
                href="#"
                className="flex-1 border-2 border-[#1bafe1] text-[#1bafe1] py-3 rounded font-medium hover:bg-[#1bafe1] hover:text-white transition-colors text-center"
              >
                Convidar para Projeto
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
