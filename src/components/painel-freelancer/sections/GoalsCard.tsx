import { useEffect, useState } from 'react';

const goals = [
  { label: 'Completar Perfil', checked: false },
  { label: 'Enviar Feedback', checked: false },
  { label: 'Enviar Proposta', checked: false },
  { label: 'Receber Recomendação', checked: false },
  { label: 'Convidar Amigos', checked: false },
];

export default function GoalsCard() {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const progressValue = 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(progressValue);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white rounded shadow-sm border border-[#e0e0e0]">
      {/* Header */}
      <div className="p-4 border-b border-[#e0e0e0]">
        <h3 className="text-base font-semibold text-[#333]">Minhas metas</h3>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Progress */}
        <div className="mb-4">
          <p className="text-sm text-[#666] text-center mb-2">
            Metas concluídas (0%)
          </p>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#5cb85c] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${animatedWidth}%` }}
            />
          </div>
        </div>

        {/* Goals List */}
        <ul className="space-y-2">
          {goals.map((goal, index) => (
            <li key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={goal.checked}
                readOnly
                className="w-4 h-4 border border-gray-300 rounded cursor-not-allowed"
              />
              <span className="text-sm text-[#666]">
                {goal.label} <span className="text-[#999]">(+)</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
