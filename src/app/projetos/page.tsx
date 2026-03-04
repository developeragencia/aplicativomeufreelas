/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";

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

export default function ProjetosPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todas as categorias");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories.php`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Erro ao carregar categorias", err));

    // Fetch projects
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects.php`)
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar projetos", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-light text-gray-800">Resultado da pesquisa</h1>
              <p className="text-gray-600">{projects.length} projetos foram encontrados</p>
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
                    {categories.map((category, index) => (
                      <li key={index}>
                        <button
                          onClick={() => setSelectedCategory(category.name)}
                          className={`text-sm text-left w-full ${
                            selectedCategory === category.name
                              ? "text-[#1bafe1] font-medium"
                              : "text-gray-600 hover:text-[#1bafe1]"
                          }`}
                        >
                          {category.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            {/* Projects List */}
            <div className="flex-grow">
              <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">
                {loading ? (
                  <div className="p-10 text-center">Carregando projetos...</div>
                ) : (
                  projects.map((project, index) => (
                    <div
                      key={project.id}
                      className={`bg-white p-5 relative ${index !== projects.length - 1 ? 'border-b border-gray-200' : ''}`}
                    >
                      <Link
                        href={`/projeto/${project.id}`}
                        className="text-[#1bafe1] font-medium text-lg hover:underline block mb-2 pr-12"
                      >
                        {project.title}
                      </Link>

                      <p className="text-sm text-gray-600 mb-3">
                        {project.category} | {project.status} | Publicado: <strong>Hoje</strong> |
                        Orcamento: <strong>R${project.budget_min} - R${project.budget_max}</strong> |
                        Propostas: <strong>{project.proposals_count}</strong>
                      </p>

                      <p className="text-sm text-gray-700 mb-3 whitespace-pre-line line-clamp-4">
                        {project.description}
                      </p>

                      <div className="mt-3">
                        <Link
                          href={`/projeto/${project.id}`}
                          className="text-[#1bafe1] hover:underline text-sm font-medium"
                        >
                          Ver detalhes do projeto &gt;
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}