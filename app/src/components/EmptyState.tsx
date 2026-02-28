import type { ReactNode } from 'react';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
  className?: string;
};

export default function EmptyState({ title, description, icon, ctaHref, ctaLabel, className }: EmptyStateProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center ${className || ''}`}>
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon || <User className="w-8 h-8 text-gray-300" />}
      </div>
      <h3 className="text-gray-900 font-medium mb-1">{title}</h3>
      {description && <p className="text-gray-500 text-sm mb-3">{description}</p>}
      {ctaHref && ctaLabel && (
        <Link to={ctaHref} className="text-99blue hover:underline text-sm">{ctaLabel}</Link>
      )}
    </div>
  );
}
