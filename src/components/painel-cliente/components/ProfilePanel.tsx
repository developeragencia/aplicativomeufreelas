import { useState, useEffect } from 'react';
import { Pencil, Star } from 'lucide-react';
import { currentUser } from '../data/mockData';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

export const ProfilePanel = () => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(currentUser.profileCompletion);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white border border-freelas-border rounded shadow-card p-5 animate-fade-in-up stagger-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-freelas-text">Meu perfil</h2>
        <a
          href="#"
          className="flex items-center gap-1 text-sm text-freelas-primary hover:underline transition-all"
        >
          <Pencil className="w-4 h-4" />
          Editar
        </a>
      </div>

      {/* Profile Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-freelas-success rounded flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
          {currentUser.avatar}
        </div>
        <div>
          <h3 className="text-base font-semibold text-freelas-primary">
            {currentUser.name}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4 text-freelas-border fill-freelas-border"
              />
            ))}
            <span className="text-sm text-freelas-text-muted ml-1">
              ({currentUser.reviewCount} avaliações)
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="text-sm text-freelas-text-secondary mb-2">
          Perfil preenchido ({currentUser.profileCompletion}%)
        </div>
        <div className="h-2 bg-freelas-border rounded-full overflow-hidden">
          <div
            className="h-full bg-freelas-primary rounded-full progress-bar-animate"
            style={{ width: `${animatedProgress}%` }}
          />
        </div>
      </div>

      {/* Complete Section */}
      <div>
        <p className="text-sm text-freelas-text-secondary mb-1">Complete:</p>
        <p className="text-sm text-freelas-text">
          • Detalhes sobre você (+ 50%)
        </p>
      </div>
    </div>
  );
};

export default ProfilePanel;
