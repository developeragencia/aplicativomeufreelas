import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Edit } from 'lucide-react';

const profileItems = [
  { label: 'Título profissional', bonus: '+ 15%' },
  { label: 'Detalhes sobre você', bonus: '+ 15%' },
  { label: 'Experiência profissional', bonus: '+ 15%' },
  { label: 'Áreas de interesse', bonus: '+ 15%' },
  { label: 'Habilidades', bonus: '+ 15%' },
];

export default function ProfileCard() {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const progressValue = 25;

  useEffect(() => {
    // Animate progress bar on mount
    const timer = setTimeout(() => {
      setAnimatedWidth(progressValue);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white rounded shadow-sm border border-[#e0e0e0]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#e0e0e0]">
        <h3 className="text-base font-semibold text-[#333]">Meu perfil</h3>
        <Link
          href="/editar-perfil"
          className="flex items-center gap-1 text-sm text-[#00a8cc] hover:text-[#0088aa] link-hover"
        >
          <Edit className="w-3 h-3" />
          Editar
        </Link>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Profile Info */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="w-[60px] h-[60px] rounded bg-[#1a5f4a] flex items-center justify-center text-white text-2xl font-medium flex-shrink-0">
            H
          </div>

          {/* Info */}
          <div className="flex-1">
            <h4 className="text-base font-semibold text-[#00a8cc] mb-1">
              Hugo Carvana
            </h4>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-gray-300" fill="none" />
              ))}
              <span className="text-sm text-[#999] ml-1">(0 avaliações)</span>
            </div>

            {/* Membership */}
            <p className="text-sm text-[#666]">
              Membro básico.{' '}
              <Link href="/minhas-assinaturas" className="text-[#00a8cc] hover:text-[#0088aa] link-hover">
                Seja premium.
              </Link>
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#666]">Perfil preenchido (25%)</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00a8cc] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${animatedWidth}%` }}
            />
          </div>
        </div>

        {/* Complete List */}
        <div>
          <p className="text-sm font-medium text-[#666] mb-2">Complete:</p>
          <ul className="space-y-2">
            {profileItems.map((item, index) => (
              <li key={index} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-[#666]">
                  <span className="text-[#999]">•</span>
                  {item.label}
                </span>
                <span className="text-[#999] text-xs">{item.bonus}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
