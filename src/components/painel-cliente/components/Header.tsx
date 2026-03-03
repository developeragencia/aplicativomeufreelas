import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, MessageSquare, Flag } from 'lucide-react';
import {
  projetosDropdownItems,
  freelancersDropdownItems,
  perfilDropdownItems,
  contaDropdownItems,
  ferramentasDropdownItems,
  ajudaDropdownItems,
  currentUser,
} from '../data/mockData';

interface DropdownProps {
  title: string;
  items: { label: string; href: string }[];
  isOpen: boolean;
  onToggle: () => void;
}

const NavDropdown = ({ title, items, isOpen, onToggle }: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) onToggle();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className={`flex items-center gap-1 px-4 py-3 text-sm text-white transition-colors hover:bg-white/10 ${
          isOpen ? 'bg-white/10' : ''
        }`}
      >
        {title}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-0 bg-white border border-freelas-border rounded shadow-dropdown min-w-[200px] z-50 animate-slide-down">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="block px-4 py-2 text-sm text-freelas-text hover:bg-freelas-bg transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
      >
        <div className="w-7 h-7 bg-freelas-success rounded flex items-center justify-center text-white font-bold text-sm">
          {currentUser.avatar}
        </div>
        <span className="text-sm">{currentUser.name} (Cliente)</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-freelas-border rounded shadow-dropdown min-w-[280px] z-50 animate-slide-down">
          <div className="p-3 border-b border-freelas-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-freelas-success rounded flex items-center justify-center text-white font-bold">
                {currentUser.avatar}
              </div>
              <div>
                <div className="font-medium text-freelas-text">{currentUser.name}</div>
                <div className="text-sm text-freelas-text-secondary">Cliente</div>
              </div>
            </div>
          </div>
          <div className="p-3 border-b border-freelas-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-freelas-success rounded flex items-center justify-center text-white font-bold">
                  {currentUser.avatar}
                </div>
                <div>
                  <div className="font-medium text-freelas-text">{currentUser.name}</div>
                  <div className="text-sm text-freelas-text-secondary">Freelancer</div>
                </div>
              </div>
              <button className="px-3 py-1 bg-freelas-success text-white text-sm rounded hover:bg-freelas-success/90 transition-colors">
                Selecionar
              </button>
            </div>
          </div>
          <div className="p-3">
            <button className="w-full text-left text-sm text-freelas-text hover:text-freelas-primary transition-colors">
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const Header = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <header>
      {/* Top bar - Dark section with Logo, Search and User */}
      <div className="bg-freelas-header">
        <div className="max-w-7xl mx-auto px-4 h-[60px] flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center flex-shrink-0">
            <span className="text-2xl font-bold text-white">99</span>
            <span className="text-2xl font-bold text-freelas-primary">freelas</span>
          </a>

          {/* Search Bar */}
          <div className="flex items-center flex-1 max-w-[500px] mx-12">
            <button className="flex items-center gap-1 px-4 py-2 bg-freelas-primary text-white text-sm font-medium rounded-l hover:bg-freelas-primary-dark transition-colors">
              Freelancers
              <ChevronDown className="w-3 h-3" />
            </button>
            <input
              type="text"
              placeholder="Buscar freelancers"
              className="flex-1 px-4 py-2 text-sm bg-white border-0 focus:outline-none focus:ring-0"
            />
            <button className="px-4 py-2 bg-white rounded-r text-freelas-text-muted hover:text-freelas-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Right side - User and Icons */}
          <div className="flex items-center gap-6">
            {/* User Profile */}
            <UserDropdown />

            {/* Icons */}
            <div className="flex items-center gap-4">
              <button className="text-white hover:text-freelas-primary transition-colors">
                <MessageSquare className="w-5 h-5" />
              </button>
              <button className="text-white hover:text-freelas-primary transition-colors">
                <Flag className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Blue section */}
      <nav className="bg-freelas-primary">
        <div className="max-w-7xl mx-auto px-4 flex items-center h-[42px]">
          <a
            href="#"
            className="px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors h-full flex items-center"
          >
            Página inicial
          </a>
          <NavDropdown
            title="Projetos"
            items={projetosDropdownItems}
            isOpen={openDropdown === 'projetos'}
            onToggle={() => toggleDropdown('projetos')}
          />
          <NavDropdown
            title="Freelancers"
            items={freelancersDropdownItems}
            isOpen={openDropdown === 'freelancers'}
            onToggle={() => toggleDropdown('freelancers')}
          />
          <NavDropdown
            title="Perfil"
            items={perfilDropdownItems}
            isOpen={openDropdown === 'perfil'}
            onToggle={() => toggleDropdown('perfil')}
          />
          <NavDropdown
            title="Conta"
            items={contaDropdownItems}
            isOpen={openDropdown === 'conta'}
            onToggle={() => toggleDropdown('conta')}
          />
          <NavDropdown
            title="Ferramentas"
            items={ferramentasDropdownItems}
            isOpen={openDropdown === 'ferramentas'}
            onToggle={() => toggleDropdown('ferramentas')}
          />
          <NavDropdown
            title="Ajuda"
            items={ajudaDropdownItems}
            isOpen={openDropdown === 'ajuda'}
            onToggle={() => toggleDropdown('ajuda')}
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
