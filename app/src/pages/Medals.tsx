import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Medal, Trophy, Zap, Shield, Star, Clock, Award, Lock } from 'lucide-react';

const MEDALS = [
  {
    id: '1',
    name: 'Iniciante',
    description: 'Completou o primeiro projeto com sucesso.',
    icon: Star,
    color: 'text-blue-500',
    bg: 'bg-blue-100',
    progress: 100,
    unlocked: true,
  },
  {
    id: '2',
    name: 'Top Rated',
    description: 'Manteve uma avaliação média acima de 4.8 em 10 projetos.',
    icon: Trophy,
    color: 'text-yellow-500',
    bg: 'bg-yellow-100',
    progress: 80,
    unlocked: false,
  },
  {
    id: '3',
    name: 'Entrega Relâmpago',
    description: 'Entregou 5 projetos antes do prazo final.',
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-100',
    progress: 100,
    unlocked: true,
  },
  {
    id: '4',
    name: 'Verificado',
    description: 'Verificou identidade e documentos.',
    icon: Shield,
    color: 'text-green-500',
    bg: 'bg-green-100',
    progress: 100,
    unlocked: true,
  },
  {
    id: '5',
    name: 'Veterano',
    description: 'Ativo na plataforma por mais de 1 ano.',
    icon: Clock,
    color: 'text-purple-500',
    bg: 'bg-purple-100',
    progress: 45,
    unlocked: false,
  },
  {
    id: '6',
    name: 'Mestre',
    description: 'Completou 50 projetos com avaliação máxima.',
    icon: Award,
    color: 'text-red-500',
    bg: 'bg-red-100',
    progress: 20,
    unlocked: false,
  },
];

export default function Medals() {
  return (
    <AppShell>
      <div className="container mx-auto py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suas Conquistas</h1>
          <p className="text-muted-foreground mt-1">
            Desbloqueie medalhas completando desafios e melhorando seu perfil.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MEDALS.map((medal) => (
            <Card key={medal.id} className={medal.unlocked ? '' : 'opacity-75 grayscale-[0.5]'}>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className={`p-3 rounded-full ${medal.unlocked ? medal.bg : 'bg-gray-100'}`}>
                  <medal.icon className={`h-6 w-6 ${medal.unlocked ? medal.color : 'text-gray-400'}`} />
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
          ))}
        </div>
      </div>
    </AppShell>
  );
}
