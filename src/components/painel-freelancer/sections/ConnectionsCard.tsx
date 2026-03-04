import Link from 'next/link';

export default function ConnectionsCard() {
  return (
    <div className="bg-white rounded shadow-sm border border-[#e0e0e0]">
      {/* Header */}
      <div className="p-4 border-b border-[#e0e0e0]">
        <h3 className="text-base font-semibold text-[#333]">Minhas conexões</h3>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Available Connections */}
        <p className="text-sm text-[#666] mb-3">
          <span className="font-medium">Conexões disponíveis:</span>{' '}
          <span className="text-[#00a8cc] font-semibold">10</span>
        </p>

        {/* Description */}
        <p className="text-sm text-[#666] mb-3 leading-relaxed">
          10 conexões restantes de um total de 10 referentes ao seu plano (Gratuito). 
          Essas conexões serão renovadas no dia 02/04/2026.
        </p>

        {/* Non-expiring */}
        <p className="text-sm text-[#666] mb-4">
          0 conexões não expiráveis.
        </p>

        {/* Button */}
        <Link
          href="/minhas-assinaturas"
          className="inline-block w-full sm:w-auto px-4 py-2 bg-[#00a8cc] hover:bg-[#0088aa] text-white text-sm font-medium rounded btn-hover transition-colors duration-200 text-center"
        >
          Assinar plano
        </Link>
      </div>
    </div>
  );
}
