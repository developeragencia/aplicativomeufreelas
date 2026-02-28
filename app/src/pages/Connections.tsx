import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Zap, CreditCard, Calendar, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Transaction {
  id: number;
  amount: number;
  description: string;
  type: 'usage' | 'refill' | 'bonus';
  date: string;
}

export default function Connections() {
  const [balance, setBalance] = useState(0);
  const [maxMonthly, setMaxMonthly] = useState(40);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/connections');
      setBalance(res.data.balance || 0);
      setMaxMonthly(res.data.max_monthly || 40);
      setTransactions(res.data.transactions || []);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar conexões');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBuy = async (pack: 'basic' | 'pro') => {
    try {
      await api.post('/connections', { action: 'buy', pack });
      toast.success('Pacote comprado com sucesso! (Simulado)');
      fetchData(); // Refresh balance
    } catch (error) {
      toast.error('Erro na compra');
    }
  };

  const usagePercent = Math.min((balance / maxMonthly) * 100, 100);

  if (loading) {
    return (
      <AppShell>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      </AppShell>
    );
  }

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
              <div className="text-2xl font-bold">{balance}</div>
              <p className="text-xs text-muted-foreground">de {maxMonthly} mensais (estimado)</p>
              <Progress value={usagePercent} className="mt-2 h-1" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usadas este mês</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transactions.filter(t => t.amount < 0).reduce((acc, curr) => acc + Math.abs(curr.amount), 0)}
              </div>
              <p className="text-xs text-muted-foreground">propostas enviadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próxima Renovação</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">01/03</div>
              <p className="text-xs text-muted-foreground">Em breve</p>
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
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                        Nenhuma transação encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((t) => (
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
                    ))
                  )}
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
                <Button className="w-full" onClick={() => handleBuy('basic')}>Comprar Agora</Button>
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
                <Button variant="outline" className="w-full" onClick={() => handleBuy('pro')}>Comprar Agora</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
