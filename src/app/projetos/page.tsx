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

          {/* Projects List */}
          <div className="flex-grow">
            <h1 className="text-2xl font-semibold mb-6">Projetos Recentes</h1>
            <div className="space-y-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
    title: "Criar loja shopify em tema de camisetas de time",
    category: "Vendas & Marketing",
  },
];
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
