"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";

export default function Header() {
  const [searchType, setSearchType] = useState<"freelancers" | "projetos">("freelancers");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchType === "freelancers") {
      window.location.href = `/freelancers?q=${encodeURIComponent(searchQuery)}`;
    } else {
      window.location.href = `/projetos?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="bg-[#47484d] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center">
              <span className="text-white text-2xl font-bold">
                <span className="text-[#1bafe1]">99</span>free<span className="text-[#1bafe1]">las</span>
              </span>
            </div>
          </Link>

          {/* Search Box - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md">
            <form onSubmit={handleSearch} className="flex w-full">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSearchType(searchType === "freelancers" ? "projetos" : "freelancers")}
                  className="bg-[#1bafe1] text-white px-4 py-2 rounded-l flex items-center gap-2 hover:bg-[#2595cb] transition-colors"
                >
                  <span className="text-sm font-medium capitalize">{searchType}</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Buscar ${searchType}`}
                className="flex-1 px-4 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-[#1bafe1] text-sm"
              />
              <button
                type="submit"
                className="bg-white px-4 py-2 rounded-r hover:bg-gray-100 transition-colors"
              >
                <Search className="w-4 h-4 text-gray-600" />
              </button>
            </form>
          </div>

          {/* Right Links - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-white hover:text-[#1bafe1] text-sm transition-colors">
              Login
            </Link>
            <Link href="/cadastro" className="text-white hover:text-[#1bafe1] text-sm transition-colors">
              Cadastre-se
            </Link>
            <Link
              href="/publicar-projeto"
              className="bg-[#1bafe1] text-white px-5 py-2 rounded text-sm font-medium hover:bg-[#2595cb] transition-colors"
            >
              Publicar projeto
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white p-2"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden mt-3">
            <form onSubmit={handleSearch} className="flex">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as "freelancers" | "projetos")}
                className="bg-[#1bafe1] text-white px-3 py-2 rounded-l text-sm"
              >
                <option value="freelancers">Freelancers</option>
                <option value="projetos">Projetos</option>
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Buscar ${searchType}`}
                className="flex-1 px-3 py-2 text-sm"
              />
              <button type="submit" className="bg-white px-3 py-2 rounded-r">
                <Search className="w-4 h-4 text-gray-600" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-3 pb-3 border-t border-gray-600 pt-3">
            <div className="flex flex-col gap-3">
              <Link href="/login" className="text-white hover:text-[#1bafe1] text-sm">
                Login
              </Link>
              <Link href="/cadastro" className="text-white hover:text-[#1bafe1] text-sm">
                Cadastre-se
              </Link>
              <Link
                href="/publicar-projeto"
                className="bg-[#1bafe1] text-white px-4 py-2 rounded text-sm text-center"
              >
                Publicar projeto
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
