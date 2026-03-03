import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: 'Página inicial', href: '/' },
  {
    label: 'Projetos',
    href: '#',
    children: [
      { label: 'Buscar projetos', href: '/buscar-projetos' },
      { label: 'Meus projetos', href: '/meus-projetos' },
      { label: 'Minhas propostas', href: '/minhas-propostas' },
      { label: 'Propostas promovidas', href: '/propostas-promovidas' },
      { label: 'Projetos salvos', href: '/projetos-salvos' },
      { label: 'Clientes seguidos', href: '/clientes-seguidos' },
    ],
  },
  {
    label: 'Freelancers',
    href: '#',
    children: [
      { label: 'Buscar freelancers', href: '/buscar-freelancers' },
    ],
  },
  {
    label: 'Perfil',
    href: '#',
    children: [
      { label: 'Editar perfil', href: '/editar-perfil' },
      { label: 'Meu perfil', href: '/meu-perfil' },
      { label: 'Editar portfólio', href: '/editar-portfolio' },
      { label: 'Validação de identidade', href: '/validacao-identidade' },
      { label: 'Medalhas', href: '/medalhas' },
      { label: 'Histórico de conexões', href: '/historico-conexoes' },
      { label: 'Estoque de conexões', href: '/estoque-conexoes' },
    ],
  },
  {
    label: 'Conta',
    href: '#',
    children: [
      { label: 'Cartões de crédito', href: '/cartoes-credito' },
      { label: 'Configurações de acesso', href: '/configuracoes-acesso' },
      { label: 'Conta bancária', href: '/conta-bancaria' },
      { label: 'Histórico de pagamentos', href: '/historico-pagamentos' },
      { label: 'Histórico de reembolsos', href: '/historico-reembolsos' },
      { label: 'Informações de localização', href: '/informacoes-localizacao' },
      { label: 'Meus rendimentos', href: '/meus-rendimentos' },
      { label: 'Minhas assinaturas', href: '/minhas-assinaturas' },
      { label: 'Notificações e alertas', href: '/notificacoes-alertas' },
      { label: 'Verificações de documentos', href: '/verificacoes-documentos' },
    ],
  },
  {
    label: 'Ferramentas',
    href: '#',
    children: [
      { label: 'Calculadora freelancer', href: '/calculadora-freelancer' },
      { label: 'Formatação de textos', href: '/formatacao-textos' },
    ],
  },
  {
    label: 'Ajuda',
    href: '#',
    children: [
      { label: 'Fluxo de um projeto', href: '/fluxo-projeto' },
      { label: 'Como funciona', href: '/como-funciona' },
      { label: 'Central de ajuda', href: '/central-ajuda' },
      { label: 'Blog', href: '/blog' },
    ],
  },
];

export default function NavigationBar() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = (label: string) => {
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <nav className="bg-[#00a8cc] h-[45px]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-full">
        <ul className="flex items-center h-full gap-1">
          {navItems.map((item) => (
            <li
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
              ref={item.children ? dropdownRef : undefined}
            >
              {item.children ? (
                <>
                  <button
                    className={`
                      flex items-center gap-1 px-4 py-2 text-sm font-medium text-white rounded
                      transition-all duration-200
                      ${activeDropdown === item.label ? 'bg-[#0088aa]' : 'hover:bg-white/10'}
                    `}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {activeDropdown === item.label && (
                    <div className="absolute top-full left-0 bg-white rounded shadow-lg py-2 min-w-[220px] z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#00a8cc] transition-colors duration-200"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`
                    block px-4 py-2 text-sm font-medium text-white rounded
                    transition-all duration-200
                    ${pathname === item.href ? 'bg-[#0088aa]' : 'hover:bg-white/10'}
                  `}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
