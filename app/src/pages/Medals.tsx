import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Medal, Trophy, Zap, Shield, Star, Clock, Award, Lock, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface MedalData {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  color: string;
  bg: string;
  progress: number;
  unlocked: boolean;
}

const iconMap: Record<string, any> = {
  Star, Trophy, Zap, Shield, Clock, Award
};

export default function Medals() {
  const [medals, setMedals] = useState<MedalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMedals() {
      setLoading(true);
      try {
        const res = await api.get('/medals');
        setMedals(res.data.data || []);
      } catch (error) {
        console.error(error);
        toast.error('Erro ao carregar medalhas');
      } finally {
        setLoading(false);
      }
    }
    fetchMedals();
  }, []);

  return (
    <AppShell>
      <div className="container mx-auto py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suas Conquistas</h1>
          <p className="text-muted-foreground mt-1">
            Desbloqueie medalhas completando desafios e melhorando seu perfil.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medals.map((medal) => {
              const Icon = iconMap[medal.icon_name] || Star;
              return (
                <Card key={medal.id} className={medal.unlocked ? '' : 'opacity-75 grayscale-[0.5]'}>
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <div className={`p-3 rounded-full ${medal.unlocked ? medal.bg : 'bg-gray-100'}`}>
                      <Icon className={`h-6 w-6 ${medal.unlocked ? medal.color : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg flex justify-between items-center">
                        {medal.name}
                        {!medal.unlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 min-h-[40px]">
                      {medal.description}
                    </CardDescription>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progresso</span>
                        <span>{medal.progress}%</span>
                      </div>
                      <Progress value={medal.progress} className="h-2" />
                    </div>
                    
                    <div className="mt-4">
                      {medal.unlocked ? (
                        <Badge variant="default" className="bg-green-600 hover:bg-green-700">Desbloqueado</Badge>
                      ) : (
                        <Badge variant="outline">Bloqueado</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
