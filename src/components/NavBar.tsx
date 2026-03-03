"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: "/como-funciona", label: "Como Funciona" },
    { href: "/freelancers", label: "Encontrar Freelancers" },
    { href: "/projetos", label: "Encontrar Trabalho" },
  ];

  return (
    <nav className="bg-[#3a3d42] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-end gap-6 py-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm hover:text-[#1bafe1] transition-colors ${
                pathname === link.href ? "text-[#1bafe1]" : "text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
