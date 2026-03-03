import { Award, Lock, Star, Zap, Target, Trophy } from 'lucide-react';

const medals = [
  {
    id: 1,
    name: 'Primeiro Projeto',
    description: 'Complete seu primeiro projeto na plataforma',
    icon: Star,
    unlocked: true,
    color: '#ffd700',
    date: '15/01/2024',
  },
  {
    id: 2,
    name: 'Freelancer Destaque',
    description: 'Receba 5 avaliações 5 estrelas',
    icon: Trophy,
    unlocked: false,
    color: '#c0c0c0',
    progress: 3,
    total: 5,
  },
  {
    id: 3,
    name: 'Especialista',
    description: 'Complete 10 projetos na mesma categoria',
    icon: Target,
    unlocked: false,
    color: '#cd7f32',
    progress: 4,
    total: 10,
  },
  {
    id: 4,
    name: 'Super Rápido',
    description: 'Entregue 5 projetos antes do prazo',
    icon: Zap,
    unlocked: false,
    color: '#00bcd4',
    progress: 1,
    total: 5,
  },
  {
    id: 5,
    name: 'Cliente Fiel',
    description: 'Trabalhe 3 vezes com o mesmo cliente',
    icon: Award,
    unlocked: false,
    color: '#9c27b0',
    progress: 0,
    total: 3,
  },
  {
    id: 6,
    name: 'Top Freelancer',
    description: 'Esteja no ranking dos top 100 freelancers',
    icon: Trophy,
    unlocked: false,
    color: '#ff9800',
    progress: 0,
    total: 1,
  },
];

export default function Medalhas() {
  const unlockedCount = medals.filter(m => m.unlocked).length;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-2">Medalhas</h1>
      <p className="text-[#666] mb-6">
        Você desbloqueou {unlockedCount} de {medals.length} medalhas
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medals.map((medal) => (
          <div
            key={medal.id}
            className={`bg-white rounded shadow-sm p-6 ${
              medal.unlocked ? '' : 'opacity-70'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Medal Icon */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: medal.unlocked ? medal.color : '#e0e0e0' }}
              >
                {medal.unlocked ? (
                  <medal.icon className="w-8 h-8 text-white" />
                ) : (
                  <Lock className="w-6 h-6 text-gray-400" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#333] mb-1">
                  {medal.name}
                </h3>
                <p className="text-sm text-[#666] mb-3">{medal.description}</p>

                {medal.unlocked ? (
                  <p className="text-xs text-[#5cb85c] font-medium">
                    Desbloqueada em {medal.date}
                  </p>
                ) : (
                  <div>
                    <div className="flex justify-between text-xs text-[#666] mb-1">
                      <span>Progresso</span>
                      <span>
                        {medal.progress}/{medal.total}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00a8cc] rounded-full transition-all duration-500"
                        style={{
                          width: `${((medal.progress || 0) / (medal.total || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
