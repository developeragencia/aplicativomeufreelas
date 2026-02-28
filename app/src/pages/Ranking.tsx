import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Star } from 'lucide-react';

// Mock Data
const MOCK_RANKING = [
  {
    id: '1',
    rank: 1,
    name: 'Ana Silva',
    role: 'Desenvolvedora Full Stack',
    score: 9850,
    projects: 42,
    avatar: 'https://github.com/shadcn.png',
    badges: ['top-rated', 'fast-delivery'],
  },
  {
    id: '2',
    rank: 2,
    name: 'Carlos Oliveira',
    role: 'Designer UI/UX',
    score: 9200,
    projects: 38,
    avatar: '',
    badges: ['creative'],
  },
  {
    id: '3',
    rank: 3,
    name: 'Mariana Costa',
    role: 'Redatora SEO',
    score: 8950,
    projects: 55,
    avatar: '',
    badges: ['reliable'],
  },
  {
    id: '4',
    rank: 4,
    name: 'Pedro Santos',
    role: 'Engenheiro de Mobile',
    score: 8500,
    projects: 29,
    avatar: '',
    badges: [],
  },
  {
    id: '5',
    rank: 5,
    name: 'Julia Lima',
    role: 'Marketing Digital',
    score: 8100,
    projects: 31,
    avatar: '',
    badges: [],
  },
];

export default function Ranking() {
  const [period, setPeriod] = useState('weekly');

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-muted-foreground font-bold">#{rank}</span>;
  };

  return (
    <AppShell>
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ranking de Freelancers</h1>
            <p className="text-muted-foreground mt-1">
              Confira os profissionais com melhor desempenho na plataforma.
            </p>
          </div>
          
          <Tabs defaultValue="weekly" onValueChange={setPeriod} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="weekly">Semanal</TabsTrigger>
              <TabsTrigger value="monthly">Mensal</TabsTrigger>
              <TabsTrigger value="all-time">Geral</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-center">Posição</TableHead>
                <TableHead>Freelancer</TableHead>
                <TableHead className="hidden md:table-cell">Especialidade</TableHead>
                <TableHead className="text-right">Projetos</TableHead>
                <TableHead className="text-right">Pontuação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_RANKING.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-center">
                    <div className="flex justify-center items-center">
                      {getRankIcon(user.rank)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <div className="flex gap-1 md:hidden">
                          <span className="text-xs text-muted-foreground">{user.role}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {user.role}
                  </TableCell>
                  <TableCell className="text-right">{user.projects}</TableCell>
                  <TableCell className="text-right font-bold">
                    <div className="flex items-center justify-end gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      {user.score.toLocaleString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppShell>
  );
}
