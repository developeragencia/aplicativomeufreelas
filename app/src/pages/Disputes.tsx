import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Clock, Gavel, MessageSquare, Loader2 } from 'lucide-react';
import { api, apiPostForm } from '@/lib/api';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';

interface Dispute {
  id: string;
  project: string;
  reason: string;
  status: 'open' | 'under_review' | 'resolved' | 'closed';
  date: string;
  updated: string;
  amount: string;
  outcome?: string;
}

export default function Disputes() {
  const { isAuthenticated } = useAuth();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [project, setProject] = useState('');
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [contractId, setContractId] = useState('');
  const [category, setCategory] = useState<'prazo' | 'qualidade' | 'escopo' | 'pagamento' | ''>('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const schema = z.object({
    project: z.string().min(2, { message: 'Informe o projeto' }),
    amount: z.string().min(2, { message: 'Informe o valor' }),
    reason: z.string().min(5, { message: 'Descreva o motivo' }),
  });

  useEffect(() => {
    async function fetchDisputes() {
      setLoading(true);
      try {
        const res = await api.get('/disputes');
        setDisputes(res.data.data || []);
      } catch (error) {
        console.error(error);
        toast.error('Erro ao carregar disputas');
      } finally {
        setLoading(false);
      }
    }
    fetchDisputes();
  }, []);

  async function handleCreate() {
    const parsed = schema.safeParse({ project, amount, reason });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || 'Dados inválidos');
      return;
    }
    setCreating(true);
    try {
      if (attachments.length > 0) {
        const form = new FormData();
        form.set('project', project.trim());
        form.set('reason', reason.trim());
        form.set('amount', amount.trim());
        if (contractId.trim()) form.set('contract_id', contractId.trim());
        if (category) form.set('category', category);
        attachments.forEach((f, i) => form.append('attachments[]', f, f.name));
        await apiPostForm('/disputes', form);
      } else {
        const payload = {
          project: project.trim(),
          reason: reason.trim(),
          amount: amount.trim(),
          contract_id: contractId.trim() || undefined,
          category: category || undefined,
        };
        await api.post('/disputes', payload);
      }
      toast.success('Disputa aberta com sucesso');
      setOpenCreate(false);
      setProject('');
      setReason('');
      setAmount('');
      setContractId('');
      setCategory('');
      setAttachments([]);
      const res = await api.get('/disputes');
      setDisputes(res.data.data || []);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Erro ao abrir disputa');
    } finally {
      setCreating(false);
    }
  }

  return (
    <AppShell>
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Gavel className="h-8 w-8 text-primary" />
              Central de Disputas
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie conflitos e solicitações de reembolso.
            </p>
          </div>
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={!isAuthenticated}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Abrir Nova Disputa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Abrir nova disputa</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="project">Projeto</Label>
                  <Input id="project" value={project} onChange={(e) => setProject(e.target.value)} placeholder="Ex.: Projeto XYZ" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="contract">ID do contrato/proposta</Label>
                    <Input id="contract" value={contractId} onChange={(e) => setContractId(e.target.value)} placeholder="Ex.: 12345" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoria</Label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="border border-input rounded-md h-9 px-3 text-sm bg-background"
                    >
                      <option value="">Selecione</option>
                      <option value="pagamento">Pagamento</option>
                      <option value="prazo">Prazo</option>
                      <option value="qualidade">Qualidade</option>
                      <option value="escopo">Escopo</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Valor em disputa</Label>
                  <Input id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Ex.: R$ 500,00" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reason">Motivo</Label>
                  <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Descreva o motivo da disputa" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="attachments">Evidências (opcional)</Label>
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    onChange={(e) => setAttachments(Array.from(e.target.files || []))}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setOpenCreate(false)}>Cancelar</Button>
                  <Button onClick={handleCreate} disabled={creating}>
                    {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Abrir
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
          <Tabs defaultValue="open">
            <TabsList className="mb-4">
              <TabsTrigger value="open">Em Aberto</TabsTrigger>
              <TabsTrigger value="resolved">Resolvidas</TabsTrigger>
            </TabsList>

            <TabsContent value="open" className="space-y-4">
              {disputes.filter(d => d.status === 'open' || d.status === 'under_review').length === 0 ? (
                <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                  <CheckCircle className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <p>Nenhuma disputa aberta. Tudo tranquilo por aqui!</p>
                </div>
              ) : (
                disputes.filter(d => d.status === 'open' || d.status === 'under_review').map((dispute) => (
                  <Card key={dispute.id} className="border-l-4 border-l-yellow-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {dispute.project}
                            <Badge variant="outline">{dispute.id}</Badge>
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Aberto em: {dispute.date}
                          </CardDescription>
                        </div>
                        <Badge className="bg-yellow-500 hover:bg-yellow-600">
                          {dispute.status === 'open' ? 'Em Análise' : 'Sob Revisão'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Motivo:</span>
                          <span>{dispute.reason}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Valor em disputa:</span>
                          <span>{dispute.amount}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/20 flex justify-between items-center py-3">
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Última atualização: {dispute.updated}
                      </div>
                      <Button variant="secondary" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="resolved" className="space-y-4">
              {disputes.filter(d => d.status === 'resolved' || d.status === 'closed').length === 0 ? (
                <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                  <p>Nenhuma disputa resolvida encontrada.</p>
                </div>
              ) : (
                disputes.filter(d => d.status === 'resolved' || d.status === 'closed').map((dispute) => (
                  <Card key={dispute.id} className="border-l-4 border-l-green-500 opacity-80">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {dispute.project}
                            <Badge variant="outline">{dispute.id}</Badge>
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Resolvido em: {dispute.updated}
                          </CardDescription>
                        </div>
                        <Badge className="bg-green-600 hover:bg-green-700">Resolvido</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Motivo:</span>
                          <span>{dispute.reason}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Resultado:</span>
                          <span className="font-semibold text-green-700">{dispute.outcome}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppShell>
  );
}
