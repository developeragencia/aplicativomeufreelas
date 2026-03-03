"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function EnviarPropostaPage() {
  const [formData, setFormData] = useState({
    valor: "",
    prazo: "",
    mensagem: "",
    privado: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Proposta enviada com sucesso!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      {/* Secondary Nav */}
      <nav className="bg-[#1bafe1] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 py-2 overflow-x-auto">
            <Link href="/" className="text-sm hover:underline whitespace-nowrap">Pagina inicial</Link>
            <Link href="/projetos" className="text-sm hover:underline whitespace-nowrap">Projetos</Link>
            <Link href="/freelancers" className="text-sm hover:underline whitespace-nowrap">Freelancers</Link>
            <Link href="/dashboard" className="text-sm hover:underline whitespace-nowrap">Perfil</Link>
            <Link href="#" className="text-sm hover:underline whitespace-nowrap">Conta</Link>
            <Link href="#" className="text-sm hover:underline whitespace-nowrap">Ferramentas</Link>
            <Link href="#" className="text-sm hover:underline whitespace-nowrap">Ajuda</Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/projetos" className="text-[#1bafe1] hover:underline text-sm">
              Voltar aos resultados da pesquisa
            </Link>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-[#1bafe1] text-white p-6">
              <h1 className="text-xl font-medium">Enviar Proposta</h1>
              <p className="text-sm opacity-90 mt-1">
                Contratacao de desenvolvedor Odoo 19
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Valor */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual o valor da sua proposta? *
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">R$</span>
                  <input
                    type="number"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    placeholder="0,00"
                    className="w-40 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1bafe1]"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Valor minimo: R$ 50,00
                </p>
              </div>

              {/* Prazo */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual o prazo estimado para entrega? *
                </label>
                <select
                  value={formData.prazo}
                  onChange={(e) => setFormData({ ...formData, prazo: e.target.value })}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1bafe1]"
                  required
                >
                  <option value="">Selecione o prazo...</option>
                  <option value="1">1 dia</option>
                  <option value="2-3">2 a 3 dias</option>
                  <option value="4-7">4 a 7 dias</option>
                  <option value="8-14">8 a 14 dias</option>
                  <option value="15-30">15 a 30 dias</option>
                  <option value="30-60">30 a 60 dias</option>
                  <option value="60+">Mais de 60 dias</option>
                </select>
              </div>

              {/* Mensagem */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem para o cliente *
                </label>
                <textarea
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  rows={8}
                  placeholder="Apresente-se, explique sua experiencia com projetos similares e por que voce e a melhor escolha para este projeto..."
                  className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1bafe1] resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  Dica: Propostas personalizadas tem maior chance de serem aceitas.
                </p>
              </div>

              {/* Privacidade */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.privado}
                    onChange={(e) => setFormData({ ...formData, privado: e.target.checked })}
                    className="mt-1 rounded border-gray-300"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Manter valor e prazo privados
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Somente o cliente podera ver o valor e prazo da sua proposta. Outros freelancers nao terao acesso a essas informacoes.
                    </p>
                  </div>
                </label>
              </div>

              {/* Info Box */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Informacoes importantes
                </h3>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Sua proposta sera enviada diretamente ao cliente</li>
                  <li>• O cliente pode aceitar, rejeitar ou fazer uma contraproposta</li>
                  <li>• Voce sera notificado sobre qualquer atualizacao</li>
                  <li>• O pagamento so sera liberado apos a conclusao do projeto</li>
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#1bafe1] text-white py-3 rounded font-medium hover:bg-[#2595cb] transition-colors"
                >
                  Enviar Proposta
                </button>
                <Link
                  href="/projetos"
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded font-medium hover:bg-gray-50 transition-colors text-center"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </div>

          {/* Tips Section */}
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="font-medium text-gray-800 mb-4">Dicas para uma proposta vencedora</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-[#2ecc71] font-bold">1.</span>
                <span>Leia atentamente a descricao do projeto antes de enviar sua proposta</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2ecc71] font-bold">2.</span>
                <span>Personalize sua mensagem para mostrar que entendeu as necessidades do cliente</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2ecc71] font-bold">3.</span>
                <span>Destaque projetos similares que voce ja realizou</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2ecc71] font-bold">4.</span>
                <span>Seja realista com prazos e valores</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2ecc71] font-bold">5.</span>
                <span>Mantenha seu perfil completo e atualizado</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
