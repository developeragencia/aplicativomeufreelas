import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Clock, Gavel, MessageSquare, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

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
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

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
          <Button variant="destructive">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Abrir Nova Disputa
          </Button>
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
