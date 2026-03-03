import { FileText, Hourglass, CheckCircle, FileX } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface StatCardProps {
  type: 'published' | 'inProgress' | 'completed' | 'cancelled';
  count: number;
}

const statConfig = {
  published: {
    icon: FileText,
    label: 'Projetos publicados',
    bgColor: 'bg-freelas-success/10',
    iconColor: 'text-freelas-success',
    circleColor: 'bg-freelas-success',
  },
  inProgress: {
    icon: Hourglass,
    label: 'Em andamento',
    bgColor: 'bg-freelas-purple/10',
    iconColor: 'text-freelas-purple',
    circleColor: 'bg-freelas-purple',
  },
  completed: {
    icon: CheckCircle,
    label: 'Concluídos',
    bgColor: 'bg-freelas-teal/10',
    iconColor: 'text-freelas-teal',
    circleColor: 'bg-freelas-teal',
  },
  cancelled: {
    icon: FileX,
    label: 'Cancelados',
    bgColor: 'bg-freelas-orange/10',
    iconColor: 'text-freelas-orange',
    circleColor: 'bg-freelas-orange',
  },
};

export const StatCard = ({ type, count }: StatCardProps) => {
  const config = statConfig[type];
  const Icon = config.icon;

  return (
    <div className="bg-white border border-freelas-border rounded shadow-card p-5 flex items-center gap-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer animate-fade-in-up">
      <div className={`w-12 h-12 ${config.circleColor} rounded-full flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <div className="text-3xl font-bold text-freelas-text">{count}</div>
        <div className="text-sm text-freelas-text-secondary">{config.label}</div>
      </div>
    </div>
  );
};

export default StatCard;
