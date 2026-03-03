"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const categories = [
  { value: "", label: "Selecione uma categoria" },
  { value: "web-mobile-software", label: "Web, Mobile & Software" },
  { value: "design-criacao", label: "Design & Criacao" },
  { value: "escrita", label: "Escrita" },
  { value: "vendas-marketing", label: "Vendas & Marketing" },
  { value: "fotografia-audiovisual", label: "Fotografia & AudioVisual" },
  { value: "traducao", label: "Traducao" },
  { value: "suporte-administrativo", label: "Suporte Administrativo" },
  { value: "engenharia-arquitetura", label: "Engenharia & Arquitetura" },
  { value: "educacao-consultoria", label: "Educacao & Consultoria" },
];

export default function PublicarProjetoPage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    description: "",
    skills: "",
    budget: "",
    budgetType: "aberto",
    experienceLevel: "intermediario",
    deadline: "",
    visibility: "publico",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Projeto publicado com sucesso!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-light text-gray-800 mb-2">
            Publicar um novo projeto
          </h1>
          <p className="text-gray-600 mb-8">
            Preencha as informacoes abaixo para encontrar o freelancer ideal
          </p>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titulo do projeto *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Criacao de logotipo para empresa"
                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1bafe1]"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Seja claro e objetivo no titulo
              </p>
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1bafe1]"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descricao do projeto *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={8}
                placeholder="Descreva detalhadamente o que voce precisa..."
                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1bafe1] resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Quanto mais detalhes, melhores propostas voce recebera
              </p>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habilidades desejadas
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="Ex: Photoshop, Illustrator, Design de Logo"
                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1bafe1]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separe as habilidades por virgula
              </p>
            </div>

            {/* Budget */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orcamento
              </label>
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="budgetType"
                    value="aberto"
                    checked={formData.budgetType === "aberto"}
                    onChange={(e) => setFormData({ ...formData, budgetType: e.target.value })}
                    className="text-[#1bafe1]"
                  />
                  <span className="text-sm text-gray-600">Aberto a propostas</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="budgetType"
                    value="fixo"
                    checked={formData.budgetType === "fixo"}
                    onChange={(e) => setFormData({ ...formData, budgetType: e.target.value })}
                    className="text-[#1bafe1]"
                  />
                  <span className="text-sm text-gray-600">Valor fixo</span>
                </label>
              </div>
              {formData.budgetType === "fixo" && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">R$</span>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="0,00"
                    className="w-40 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1bafe1]"
                  />
                </div>
              )}
            </div>

            {/* Experience Level */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de experiencia desejado
              </label>
              <div className="flex flex-wrap gap-4">
                {["iniciante", "intermediario", "especialista"].map((level) => (
                  <label key={level} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="experienceLevel"
                      value={level}
                      checked={formData.experienceLevel === level}
                      onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                      className="text-[#1bafe1]"
                    />
                    <span className="text-sm text-gray-600 capitalize">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Deadline */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prazo para receber propostas
              </label>
              <select
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1bafe1]"
              >
                <option value="">Selecione...</option>
                <option value="3">3 dias</option>
                <option value="7">7 dias</option>
                <option value="15">15 dias</option>
                <option value="30">30 dias</option>
                <option value="90">90 dias</option>
              </select>
            </div>

            {/* Visibility */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibilidade
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="visibility"
                    value="publico"
                    checked={formData.visibility === "publico"}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                    className="text-[#1bafe1]"
                  />
                  <span className="text-sm text-gray-600">Publico</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="visibility"
                    value="privado"
                    checked={formData.visibility === "privado"}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                    className="text-[#1bafe1]"
                  />
                  <span className="text-sm text-gray-600">Privado (somente por convite)</span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="flex-1 bg-[#1bafe1] text-white py-3 rounded font-medium hover:bg-[#2595cb] transition-colors"
              >
                Publicar projeto
              </button>
              <Link
                href="/"
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded font-medium hover:bg-gray-50 transition-colors text-center"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
