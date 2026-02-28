import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Zap, CreditCard, Calendar, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function Connections() {
  const transactions = [
    { id: 1, type: 'usage', description: 'Proposta para "E-commerce React"', amount: -2, date: '28/02/2026' },
    { id: 2, type: 'usage', description: 'Proposta para "Landing Page"', amount: -2, date: '27/02/2026' },
    { id: 3, type: 'refill', description: 'Renovação Mensal (Plano Pro)', amount: +40, date: '01/02/2026' },
    { id: 4, type: 'usage', description: 'Proposta para "App Mobile"', amount: -4, date: '15/01/2026' },
  ];

  return (
    <AppShell>
      <div className="container mx-auto py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minhas Conexões</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas conexões para enviar propostas para projetos.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">de 40 mensais</p>
              <Progress value={80} className="mt-2 h-1" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usadas este mês</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">4 propostas enviadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próxima Renovação</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">01/03</div>
              <p className="text-xs text-muted-foreground">Em 1 dia</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* History */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold">Histórico de Uso</h2>
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="text-muted-foreground">{t.date}</TableCell>
                      <TableCell>{t.description}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={t.type === 'refill' ? 'default' : 'secondary'} 
                               className={t.type === 'refill' ? 'bg-green-600 hover:bg-green-700' : ''}>
                          {t.amount > 0 ? `+${t.amount}` : t.amount}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Buy More */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Adicionar Conexões</h2>
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Pacote Básico</CardTitle>
                <CardDescription>Ideal para alguns projetos extras</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">R$ 19,90</div>
                <div className="mt-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">+10 Conexões</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Comprar Agora</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pacote Pro</CardTitle>
                <CardDescription>Para quem envia muitas propostas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">R$ 39,90</div>
                <div className="mt-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">+25 Conexões</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Comprar Agora</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
