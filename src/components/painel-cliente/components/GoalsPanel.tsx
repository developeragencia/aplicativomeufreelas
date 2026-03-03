import { useState, useEffect } from 'react';
import { goals } from '../data/mockData';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';

export const GoalsPanel = () => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const completedCount = goals.filter((g) => g.completed).length;
  const progressPercentage = Math.round((completedCount / goals.length) * 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 500);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  return (
    <div className="bg-white border border-freelas-border rounded shadow-card p-5 animate-fade-in-up stagger-4">
      {/* Title */}
      <h2 className="text-lg font-semibold text-freelas-text mb-4">Minhas metas</h2>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="text-sm text-freelas-text-secondary mb-2">
          Metas concluídas ({progressPercentage}%)
        </div>
        <div className="h-2 bg-freelas-border rounded-full overflow-hidden">
          <div
            className="h-full bg-freelas-primary/30 rounded-full progress-bar-animate"
            style={{ width: `${animatedProgress}%` }}
          />
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-2">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="flex items-center gap-2 text-sm text-freelas-text-secondary hover:bg-freelas-bg p-1 rounded transition-colors cursor-pointer"
          >
            <div className="w-4 h-4 border border-freelas-text-muted rounded flex items-center justify-center">
              {goal.completed && (
                <div className="w-2 h-2 bg-freelas-success rounded-sm" />
              )}
            </div>
            <span>{goal.title} (+)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalsPanel;
