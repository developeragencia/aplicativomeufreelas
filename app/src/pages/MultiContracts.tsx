import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Briefcase, Plus, CheckCircle2 } from 'lucide-react';

const TEAMS = [
  {
    id: 1,
    name: 'Squad E-commerce',
    project: 'Loja Virtual de Roupas',
    status: 'active',
    members: [
      { name: 'Ana Silva', role: 'Frontend', avatar: 'https://github.com/shadcn.png' },
      { name: 'Carlos O.', role: 'Backend', avatar: '' },
      { name: 'Julia L.', role: 'Designer', avatar: '' },
    ],
    progress: 65,
  },
  {
    id: 2,
    name: 'Redesign Blog',
    project: 'Blog Institucional',
    status: 'completed',
    members: [
      { name: 'Pedro S.', role: 'Wordpress', avatar: '' },
      { name: 'Mariana C.', role: 'SEO', avatar: '' },
    ],
    progress: 100,
  },
];

export default function MultiContracts() {
  return (
    <AppShell>
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Equipes & Multi-contratação</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie múltiplos freelancers trabalhando no mesmo projeto simultaneamente.
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Criar Nova Equipe
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TEAMS.map((team) => (
            <Card key={team.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{team.name}</CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-2">
                      <Briefcase className="h-3 w-3" />
                      {team.project}
                    </CardDescription>
                  </div>
                  <Badge variant={team.status === 'active' ? 'default' : 'secondary'}>
                    {team.status === 'active' ? 'Em Andamento' : 'Concluído'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Membros da Equipe</div>
                  {team.members.map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Contrato #{1000 + idx}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 flex justify-between items-center py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {team.members.length} freelancers
                </div>
                {team.status === 'completed' && (
                  <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    Entregue
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
          
          {/* Empty State / CTA */}
          <Card className="border-dashed flex flex-col items-center justify-center text-center p-8 space-y-4 h-full min-h-[300px]">
            <div className="p-4 rounded-full bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Precisa de um time completo?</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                Contrate múltiplos especialistas para seu projeto e gerencie tudo em um só lugar.
              </p>
            </div>
            <Button variant="outline">Saiba como funciona</Button>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
