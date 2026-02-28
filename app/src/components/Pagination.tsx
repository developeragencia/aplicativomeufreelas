type Props = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
  ariaLabel?: string;
};

export default function Pagination({ currentPage, totalPages, onChange, className, ariaLabel }: Props) {
  if (totalPages <= 1) return null;
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  return (
    <nav className={className || 'flex items-center justify-center gap-2'} aria-label={ariaLabel || 'Paginação'}>
      <button
        type="button"
        aria-label="Página anterior"
        disabled={currentPage === 1}
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        className="border border-gray-300 px-3 py-2 text-sm disabled:opacity-40"
      >
        Anterior
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-label={`Ir para página ${page}`}
          onClick={() => onChange(page)}
          className={`border px-3 py-2 text-sm ${page === currentPage ? 'bg-99blue text-white border-99blue' : 'border-gray-300'}`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        aria-label="Próxima página"
        disabled={currentPage === totalPages}
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        className="border border-gray-300 px-3 py-2 text-sm disabled:opacity-40"
      >
        Próxima
      </button>
    </nav>
  );
}
