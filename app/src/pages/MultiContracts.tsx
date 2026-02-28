import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Briefcase, Plus, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiListFreelancersPublicNew, apiListProjectsPublicNew } from '@/lib/api';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';

interface SquadMember {
  name: string;
  role: string;
  avatar: string;
}

interface Squad {
  id: number;
  name: string;
  project_name: string;
  status: 'active' | 'completed' | 'archived';
  members: SquadMember[];
  progress: number;
}

export default function MultiContracts() {
  const { isAuthenticated } = useAuth();
  const [teams, setTeams] = useState<Squad[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [budget, setBudget] = useState('');
  const [membersDraft, setMembersDraft] = useState<Array<{ name: string; role: string }>>([]);
  const [projectOptions, setProjectOptions] = useState<Array<{ id: string; title: string }>>([]);
  const [freelancerOptions, setFreelancerOptions] = useState<Array<{ name: string; title?: string }>>([]);
  const schema = z.object({
    name: z.string().min(2, { message: 'Informe o nome da equipe' }),
    project_name: z.string().min(2, { message: 'Informe o projeto' }),
  });

  useEffect(() => {
    async function fetchSquads() {
      setLoading(true);
      try {
        const res = await api.get('/squads');
        setTeams(res.data.data || []);
      } catch (error) {
        console.error(error);
        toast.error('Erro ao carregar equipes');
      } finally {
        setLoading(false);
      }
    }
    fetchSquads();
  }, []);

  async function handleCreate() {
    const parsed = schema.safeParse({ name: newName, project_name: newProjectName });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || 'Dados inválidos');
      return;
    }
    setCreating(true);
    try {
      const payload = {
        name: newName.trim(),
        project_name: newProjectName.trim(),
        start_date: startDate || undefined,
        budget: budget || undefined,
        members: membersDraft.filter(m => m.name.trim() && m.role.trim()),
      };
      await api.post('/squads', payload);
      toast.success('Equipe criada com sucesso');
      setOpenCreate(false);
      setNewName('');
      setNewProjectName('');
      setStartDate('');
      setBudget('');
      setMembersDraft([]);
      const res = await api.get('/squads');
      setTeams(res.data.data || []);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Erro ao criar equipe');
    } finally {
      setCreating(false);
    }
  }

  async function fetchSuggestions() {
    try {
      const [projects, freelancers] = await Promise.all([
        apiListProjectsPublicNew({ page: 1, per_page: 10 }),
        apiListFreelancersPublicNew({ page: 1, per_page: 10 }),
      ]);
      setProjectOptions((projects.items || []).map((p: any) => ({ id: String(p.id || p.projectId || ''), title: String(p.title || p.name || '') })));
      setFreelancerOptions((freelancers.items || []).map((f: any) => ({ name: f.name, title: f.title })));
    } catch {
      // silently ignore
    }
  }

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
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button disabled={!isAuthenticated}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Nova Equipe
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar nova equipe</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="flex justify-end">
                  <Button type="button" variant="secondary" onClick={fetchSuggestions}>Buscar sugestões</Button>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="team-name">Nome da equipe</Label>
                  <Input id="team-name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex.: Squad Frontend" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-name">Nome do projeto</Label>
                  <Input id="project-name" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="Ex.: Plataforma X" />
                  {projectOptions.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Sugestões: {projectOptions.slice(0, 5).map((p, idx) => (
                        <button
                          key={idx}
                          className="underline mr-2"
                          onClick={(e) => { e.preventDefault(); setNewProjectName(p.title); }}
                        >
                          {p.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="start-date">Data de início</Label>
                    <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="budget">Orçamento</Label>
                    <Input
                      id="budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      onBlur={() => {
                        const v = budget.replace(/[^\d]/g, '');
                        if (v) {
                          const formatted = (Number(v) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                          setBudget(formatted);
                        }
                      }}
                      placeholder="Ex.: R$ 5.000,00"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Membros</Label>
                  <div className="space-y-2">
                    {membersDraft.map((m, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Input
                          value={m.name}
                          onChange={(e) => {
                            const next = [...membersDraft];
                            next[idx] = { ...next[idx], name: e.target.value };
                            setMembersDraft(next);
                          }}
                          placeholder="Nome"
                        />
                        <Input
                          value={m.role}
                          onChange={(e) => {
                            const next = [...membersDraft];
                            next[idx] = { ...next[idx], role: e.target.value };
                            setMembersDraft(next);
                          }}
                          placeholder="Função (ex.: Frontend)"
                        />
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setMembersDraft([...membersDraft, { name: '', role: '' }])}
                      >
                        Adicionar membro
                      </Button>
                      {freelancerOptions.length > 0 && (
                        <div className="text-xs text-muted-foreground flex-1">
                          Sugestões: {freelancerOptions.slice(0, 5).map((f, idx) => (
                            <button
                              key={idx}
                              className="underline mr-2"
                              onClick={(e) => {
                                e.preventDefault();
                                setMembersDraft([...membersDraft, { name: f.name, role: f.title || '' }]);
                              }}
                            >
                              {f.name}
                            </button>
                          ))}
                        </div>
                      )}
                      {membersDraft.length > 0 && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setMembersDraft(membersDraft.filter((_, i) => i !== membersDraft.length - 1))}
                        >
                          Remover último
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setOpenCreate(false)}>Cancelar</Button>
                  <Button onClick={handleCreate} disabled={creating}>
                    {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Criar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.length === 0 ? (
              <Card className="col-span-full border-dashed p-8 flex flex-col items-center justify-center text-center">
                <Users className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-lg font-semibold">Nenhuma equipe encontrada</h3>
                <p className="text-sm text-muted-foreground mt-2">Crie sua primeira equipe para começar a multi-contratação.</p>
              </Card>
            ) : (
              teams.map((team) => (
                <Card key={team.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{team.name}</CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-2">
                          <Briefcase className="h-3 w-3" />
                          {team.project_name}
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
                      {team.members.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">Nenhum membro adicionado.</p>
                      ) : (
                        team.members.map((member, idx) => (
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
                        ))
                      )}
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
              ))
            )}
            
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
        )}
      </div>
    </AppShell>
  );
}
