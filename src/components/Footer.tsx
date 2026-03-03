import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* CTA Section for Freelancers */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-center md:text-left">
              Voce e um freelancer? Nos conectamos milhares de profissionais a empresas todos os dias.
            </p>
            <Link
              href="/cadastro/freelancer"
              className="bg-[#1bafe1] text-white px-6 py-2 rounded font-medium hover:bg-[#2595cb] transition-colors"
            >
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Meu Freelas */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Meu Freelas</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/como-funciona" className="text-[#1bafe1] hover:underline text-sm">
                  Como funciona
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[#1bafe1] hover:underline text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/ajuda" className="text-[#1bafe1] hover:underline text-sm">
                  Central de ajuda
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-[#1bafe1] hover:underline text-sm">
                  Termos de uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-[#1bafe1] hover:underline text-sm">
                  Politica de privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Para Empresas */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Para Empresas</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-[#1bafe1] hover:underline text-sm">
                  Area de empresa
                </Link>
              </li>
              <li>
                <Link href="/cadastro/empresa" className="text-[#1bafe1] hover:underline text-sm">
                  Cadastro de empresa
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="text-[#1bafe1] hover:underline text-sm">
                  Como funciona
                </Link>
              </li>
              <li>
                <Link href="/publicar-projeto" className="text-[#1bafe1] hover:underline text-sm">
                  Publique seu projeto
                </Link>
              </li>
              <li>
                <Link href="/freelancers" className="text-[#1bafe1] hover:underline text-sm">
                  Lista de freelancers
                </Link>
              </li>
            </ul>
          </div>

          {/* Para Freelancers */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Para Freelancers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-[#1bafe1] hover:underline text-sm">
                  Area de freelancer
                </Link>
              </li>
              <li>
                <Link href="/cadastro/freelancer" className="text-[#1bafe1] hover:underline text-sm">
                  Cadastro de freelancer
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="text-[#1bafe1] hover:underline text-sm">
                  Como funciona
                </Link>
              </li>
              <li>
                <Link href="/projetos" className="text-[#1bafe1] hover:underline text-sm">
                  Lista de projetos
                </Link>
              </li>
            </ul>
          </div>

          {/* Siga-nos */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Siga-nos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#1bafe1] hover:underline text-sm">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-[#1bafe1] hover:underline text-sm">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-[#1bafe1] hover:underline text-sm">
                  Linkedin
                </a>
              </li>
              <li>
                <a href="#" className="text-[#1bafe1] hover:underline text-sm">
                  Google +
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>@2014-2026 Meu Freelas. Todos os direitos reservados.</p>
          <p className="mt-1">
            <Link href="/termos" className="hover:underline">Termos de uso</Link>
            {" | "}
            <Link href="/privacidade" className="hover:underline">Politica de privacidade</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
