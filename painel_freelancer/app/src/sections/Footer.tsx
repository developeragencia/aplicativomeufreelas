export default function Footer() {
  return (
    <footer className="bg-[#f0f3f5] border-t border-[#e0e0e0] mt-8">
      <div className="max-w-[1200px] mx-auto px-4 py-5">
        <div className="text-center">
          <p className="text-sm text-[#666] mb-1">
            @2014-2026 99Freelas. Todos os direitos reservados.
          </p>
          <p className="text-sm">
            <a href="#" className="text-[#00a8cc] hover:text-[#0088aa] link-hover">
              Termos de uso
            </a>
            {' | '}
            <a href="#" className="text-[#00a8cc] hover:text-[#0088aa] link-hover">
              Política de privacidade
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
