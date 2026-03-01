import { Link } from 'react-router-dom';

type BrandLogoProps = {
  to?: string;
  heightClassName?: string;
  className?: string;
  darkBg?: boolean;
};

export default function BrandLogo({ to = '/', heightClassName = 'h-9', className = '', darkBg = false }: BrandLogoProps) {
  // Simplificado para usar a imagem diretamente, evitando problemas de processamento de canvas
  // Se o fundo precisar ser removido, deve ser feito no arquivo de imagem original
  const src = '/logo-meufreelas.png';

  return (
    <Link to={to} className={`inline-flex items-center ${className}`.trim()}>
      <img
        src={src}
        alt="MeuFreelas"
        className={`${heightClassName} w-auto object-contain ${darkBg ? 'brightness-0 invert' : ''}`}
      />
    </Link>
  );
}
