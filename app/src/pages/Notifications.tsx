import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { apiListNotifications, apiMarkAllNotificationsRead, apiMarkNotificationRead } from '@/lib/api';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ExternalLink } from 'lucide-react';

export default function Notifications() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Array<{ id: string; type: string; title: string; description?: string; date?: string; isRead?: boolean; link?: string }>>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    let mounted = true;
    async function load() {
      if (!user?.id) return;
      setLoading(true);
      const res = await apiListNotifications(String(user.id));
      if (mounted && res.ok && res.notifications) setItems(res.notifications as any);
      setLoading(false);
      await apiMarkAllNotificationsRead(String(user.id));
    }
    void load();
    return () => { mounted = false; };
  }, [isAuthenticated, user?.id]);

  const markRead = async (id: string) => {
    if (!user?.id) return;
    await apiMarkNotificationRead(String(user.id), id);
    setItems((list) => list.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  return (
    <AppShell wide>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Notificações</h1>
        <p className="text-gray-600 mb-6">Alertas e atualizações da sua conta.</p>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y">
          {loading ? (
            <div className="p-6 text-sm text-gray-500">Carregando…</div>
          ) : items.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">Nenhuma notificação.</div>
          ) : (
            items.map((n) => (
              <div key={n.id} className={`p-4 flex items-start gap-3 ${n.isRead ? 'bg-white' : 'bg-amber-50'}`}>
                <div className="mt-0.5">
                  <Bell className="w-4 h-4 text-99blue" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    {n.link && (
                      <Link to={n.link} onClick={() => markRead(n.id)} className="text-xs text-99blue hover:underline flex items-center gap-1">
                        Abrir <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                  {n.description && <p className="text-xs text-gray-600 mt-1">{n.description}</p>}
                  {n.date && <p className="text-[11px] text-gray-400 mt-1">{new Date(n.date).toLocaleString('pt-BR')}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
