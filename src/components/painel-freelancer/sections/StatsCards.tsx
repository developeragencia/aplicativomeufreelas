import { DollarSign, Gavel, ThumbsUp, Eye } from 'lucide-react';

const stats = [
  {
    icon: DollarSign,
    value: 'R$ 0,00',
    label: 'Seus ganhos',
    bgColor: 'bg-[#7cb342]',
  },
  {
    icon: Gavel,
    value: '0',
    label: 'Propostas enviadas',
    bgColor: 'bg-[#9c27b0]',
  },
  {
    icon: ThumbsUp,
    value: '0',
    label: 'Propostas aceitas',
    bgColor: 'bg-[#00bcd4]',
  },
  {
    icon: Eye,
    value: '0',
    label: 'Views no perfil',
    bgColor: 'bg-[#ff9800]',
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded shadow-sm p-5 flex items-center gap-4 card-hover cursor-pointer"
        >
          {/* Icon Circle */}
          <div className={`w-[50px] h-[50px] rounded-full ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          
          {/* Text Content */}
          <div>
            <div className="text-2xl font-bold text-[#333]">
              {stat.value}
            </div>
            <div className="text-sm text-[#666]">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
