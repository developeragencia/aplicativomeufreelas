import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
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
import { Trophy, Medal, Star, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface RankingUser {
  id: string;
  rank: number;
  name: string;
  role: string;
  score: number;
  projects: number;
  avatar: string;
  badges: string[];
}

export default function Ranking() {
  const [period, setPeriod] = useState('weekly');
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchRanking() {
      setLoading(true);
      try {
        const res = await api.get(`/ranking?period=${period}`);
        setRanking(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch ranking', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRanking();
  }, [period]);

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

        <div className="rounded-md border bg-card min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : ranking.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Trophy className="h-12 w-12 mb-4 opacity-20" />
              <p>Nenhum dado de ranking para este período.</p>
            </div>
          ) : (
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
                {ranking.map((rUser) => (
                  <TableRow key={rUser.id} className={user?.id === rUser.id ? 'bg-muted/50' : ''}>
                    <TableCell className="font-medium text-center">
                      <div className="flex justify-center items-center">
                        {getRankIcon(rUser.rank)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={rUser.avatar} />
                          <AvatarFallback>{rUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{rUser.name}</span>
                          <div className="flex gap-1 md:hidden">
                            <span className="text-xs text-muted-foreground">{rUser.role}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {rUser.role}
                    </TableCell>
                    <TableCell className="text-right">{rUser.projects}</TableCell>
                    <TableCell className="text-right font-bold">
                      <div className="flex items-center justify-end gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        {rUser.score.toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AppShell>
  );
}
