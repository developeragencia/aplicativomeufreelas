export const Footer = () => {
  return (
    <footer className="bg-white border-t border-freelas-border py-4 mt-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-freelas-text-secondary">
          ©2014-2026 99Freelas. Todos os direitos reservados
        </p>
        <p className="text-sm mt-1">
          <a
            href="#"
            className="text-freelas-primary hover:underline transition-all"
          >
            Termos de uso
          </a>
          {" | "}
          <a
            href="#"
            className="text-freelas-primary hover:underline transition-all"
          >
            Política de privacidade
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
