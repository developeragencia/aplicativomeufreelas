import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { fetchRBAC } from '../lib/rbac';

export default function AdminRoute({ children }: { children: React.ReactElement }) {
  const [state, setState] = useState<{ loading: boolean; allowed: boolean }>({ loading: true, allowed: false });
  useEffect(() => {
    let alive = true;
    fetchRBAC().then((data) => {
      if (!alive) return;
      const allowed = !!data?.ok && (!!data?.admin);
      setState({ loading: false, allowed });
    });
    return () => {
      alive = false;
    };
  }, []);
  if (state.loading) return <div className="max-w-4xl mx-auto px-4 py-10 text-center text-gray-500">Verificando permissão...</div>;
  if (!state.allowed) return <Navigate to="/" replace />;
  return children;
}
