import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, MessageSquare, Bell, Menu } from 'lucide-react';

export default function TopHeader() {
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);

  return (
    <header className="bg-[#2c3e50] h-[60px] px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center text-white no-underline">
            <span className="text-2xl font-bold">99</span>
            <span className="text-2xl font-light text-gray-300">freelas</span>
          </Link>
        </div>

        {/* Center Section - Dropdown + Search */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-xl mx-8">
          {/* Projects Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 bg-[#00a8cc] hover:bg-[#0088aa] text-white px-4 py-2 rounded transition-colors duration-200"
              onMouseEnter={() => setProjectsDropdownOpen(true)}
              onMouseLeave={() => setProjectsDropdownOpen(false)}
            >
              <span className="text-sm font-medium">Projetos</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {projectsDropdownOpen && (
              <div 
                className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg py-2 min-w-[200px] z-50"
                onMouseEnter={() => setProjectsDropdownOpen(true)}
                onMouseLeave={() => setProjectsDropdownOpen(false)}
              >
                <Link href="/buscar-projetos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Buscar projetos
                </Link>
                <Link href="/meus-projetos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Meus projetos
                </Link>
                <Link href="/projetos-salvos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Projetos salvos
                </Link>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar projetos"
              className="w-full h-9 pl-4 pr-10 rounded text-sm text-gray-700 bg-white border-0 focus:outline-none focus:ring-2 focus:ring-[#00a8cc]"
            />
            <Link
              href="/buscar-projetos"
              className="absolute right-0 top-0 h-full px-3 bg-[#5cb85c] hover:bg-[#4cae4c] rounded-r transition-colors duration-200 flex items-center"
            >
              <Search className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>

        {/* Right Section - User + Icons */}
        <div className="flex items-center gap-4">
          {/* User Avatar */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1a5f4a] flex items-center justify-center text-white text-sm font-medium">
              H
            </div>
            <span className="hidden sm:block text-white text-sm">
              Hugo Carvana <span className="text-gray-400">(Freelancer)</span>
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-white transition-colors duration-200">
              <MessageSquare className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors duration-200">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors duration-200">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
