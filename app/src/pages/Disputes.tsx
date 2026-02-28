import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Clock, Gavel, MessageSquare } from 'lucide-react';

const DISPUTES = [
  {
    id: 'DISP-1024',
    project: 'E-commerce React',
    reason: 'Falta de entrega no prazo',
    status: 'open',
    date: '27/02/2026',
    updated: 'Hoje',
    amount: 'R$ 2.500,00',
  },
  {
    id: 'DISP-0988',
    project: 'Logo Design',
    reason: 'Qualidade insatisfatória',
    status: 'resolved',
    date: '10/01/2026',
    updated: '15/01/2026',
    amount: 'R$ 300,00',
    outcome: 'Reembolso parcial (50%)',
  },
];

export default function Disputes() {
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

        <Tabs defaultValue="open">
          <TabsList className="mb-4">
            <TabsTrigger value="open">Em Aberto</TabsTrigger>
            <TabsTrigger value="resolved">Resolvidas</TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="space-y-4">
            {DISPUTES.filter(d => d.status === 'open').map((dispute) => (
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
                    <Badge className="bg-yellow-500 hover:bg-yellow-600">Em Análise</Badge>
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
            ))}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {DISPUTES.filter(d => d.status === 'resolved').map((dispute) => (
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
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
