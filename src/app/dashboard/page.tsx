"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";

const stats = [
  {
    icon: (
      <div className="w-14 h-14 rounded-full bg-[#2ecc71] flex items-center justify-center">
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
        </svg>
      </div>
    ),
    value: "R$ 0,00",
    label: "Seus ganhos",
  },
  {
    icon: (
      <div className="w-14 h-14 rounded-full bg-[#9b59b6] flex items-center justify-center">
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.89 1.45l8 4A2 2 0 0122 7.24v9.53a2 2 0 01-1.11 1.79l-8 4a2 2 0 01-1.79 0l-8-4a2 2 0 01-1.1-1.8V7.24a2 2 0 011.11-1.79l8-4a2 2 0 011.78 0zM12 4.15L5 7.58v8.84l7 3.5 7-3.5V7.58l-7-3.43z"/>
        </svg>
      </div>
    ),
    value: "0",
    label: "Propostas enviadas",
  },
  {
    icon: (
      <div className="w-14 h-14 rounded-full bg-[#1bafe1] flex items-center justify-center">
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      </div>
    ),
    value: "0",
    label: "Propostas aceitas",
  },
  {
    icon: (
      <div className="w-14 h-14 rounded-full bg-[#e74c3c] flex items-center justify-center">
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
      </div>
    ),
    value: "0",
    label: "Views no perfil",
  },
];

const profileCompletion = [
  { label: "Titulo profissional", percentage: 15 },
  { label: "Detalhes sobre voce", percentage: 15 },
  { label: "Experiencia profissional", percentage: 15 },
  { label: "Areas de interesse", percentage: 15 },
  { label: "Habilidades", percentage: 15 },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      {/* Secondary Nav - Logged in user */}
      <nav className="bg-[#1bafe1] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 py-2 overflow-x-auto">
            <Link href="/" className="text-sm hover:underline whitespace-nowrap">Pagina inicial</Link>
            <Link href="/projetos" className="text-sm hover:underline whitespace-nowrap">Projetos</Link>
            <Link href="/freelancers" className="text-sm hover:underline whitespace-nowrap">Freelancers</Link>
            <Link href="/dashboard" className="text-sm hover:underline whitespace-nowrap font-medium">Perfil</Link>
            <Link href="#" className="text-sm hover:underline whitespace-nowrap">Conta</Link>
            <Link href="#" className="text-sm hover:underline whitespace-nowrap">Ferramentas</Link>
            <Link href="#" className="text-sm hover:underline whitespace-nowrap">Ajuda</Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
              >
                {stat.icon}
                <div>
                  <div className="text-xl font-semibold text-gray-800">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Section */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="font-medium text-gray-800">Meu perfil</h2>
                <Link href="#" className="text-[#1bafe1] text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Editar
                </Link>
              </div>
              <div className="p-4">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-[#1bafe1] rounded flex items-center justify-center text-white text-2xl font-bold">
                    S
                  </div>
                  <div>
                    <Link href="#" className="text-[#1bafe1] font-medium">Salatiel M</Link>
                    <div className="flex items-center gap-1 mt-1">
                      <StarRating rating={0} size="sm" />
                      <span className="text-xs text-gray-500">(0 avaliacoes)</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Membro basico.{" "}
                      <Link href="#" className="text-[#1bafe1] font-medium">Seja premium</Link>.
                    </p>
                  </div>
                </div>

                {/* Profile Completion */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Perfil preenchido (25%)</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#1bafe1] h-2 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800 mb-2">Complete:</p>
                  <ul className="space-y-1">
                    {profileCompletion.map((item, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        • {item.label} (+ {item.percentage}%)
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Connections Section */}
              <div className="border-t border-gray-200 p-4">
                <h3 className="font-medium text-gray-800 mb-3">Minhas conexoes</h3>
                <p className="text-sm text-gray-500">Nenhuma conexao encontrada.</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* My Projects */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="font-medium text-gray-800">Meus projetos</h2>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="p-4">
                  <div className="flex justify-end mb-4">
                    <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                      <option>Todos</option>
                      <option>Ativos</option>
                      <option>Concluidos</option>
                    </select>
                  </div>
                  <p className="text-center text-[#e74c3c] py-8">
                    Nenhum projeto foi encontrado.{" "}
                    <Link href="/projetos" className="text-[#1bafe1]">Buscar Projetos</Link>.
                  </p>
                </div>
              </div>

              {/* My Proposals */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="font-medium text-gray-800">Minhas propostas</h2>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="p-4">
                  <div className="flex justify-end mb-4">
                    <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                      <option>Todas</option>
                      <option>Pendentes</option>
                      <option>Aceitas</option>
                      <option>Rejeitadas</option>
                    </select>
                  </div>
                  <p className="text-center text-[#e74c3c] py-8">
                    Nenhuma proposta foi encontrada.{" "}
                    <Link href="/projetos" className="text-[#1bafe1]">Buscar Projetos</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Help Button */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-[#1bafe1] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-[#2595cb] transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
          </svg>
          Ajuda
        </button>
      </div>

      <Footer />
    </div>
  );
}
