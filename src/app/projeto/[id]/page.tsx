/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
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
                  className="block w-full bg-[#8bc34a] text-white text-center py-3 rounded font-medium hover:bg-[#7cb342] transition-colors mb-3"
                >
                  ENVIAR PROPOSTA
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