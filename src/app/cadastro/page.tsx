"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CadastroPage() {
  const [userType, setUserType] = useState<"freelancer" | "empresa">("freelancer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas nao conferem!");
      return;
    }
    alert("Cadastro realizado com sucesso!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-lg border border-gray-200 p-8 w-full max-w-md">
          <h1 className="text-2xl font-light text-center text-gray-800 mb-6">
            Criar conta no Meu Freelas
          </h1>

          {/* User Type Toggle */}
          <div className="flex mb-6 border border-gray-200 rounded overflow-hidden">
            <button
              onClick={() => setUserType("freelancer")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                userType === "freelancer"
                  ? "bg-[#1bafe1] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Sou Freelancer
            </button>
            <button
              onClick={() => setUserType("empresa")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                userType === "empresa"
                  ? "bg-[#1bafe1] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Sou Empresa
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome"
                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1bafe1]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1bafe1]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="********"
                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1bafe1]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar senha
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="********"
                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1bafe1]"
                required
              />
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 rounded" required />
              <span className="text-sm text-gray-600">
                Concordo com os{" "}
                <Link href="/termos" className="text-[#1bafe1] hover:underline">
                  Termos de uso
                </Link>{" "}
                e{" "}
                <Link href="/privacidade" className="text-[#1bafe1] hover:underline">
                  Politica de privacidade
                </Link>
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1bafe1] text-white py-3 rounded font-medium hover:bg-[#2595cb] transition-colors"
            >
              Criar conta
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Ja tem uma conta?{" "}
              <Link href="/login" className="text-[#1bafe1] font-medium hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
