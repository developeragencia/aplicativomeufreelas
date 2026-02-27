import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import Home from './pages/Home';
import ErrorBoundary from './components/ErrorBoundary';

let storageSanitized = false;

function sanitizeLocalStorageOnce(): void {
  if (storageSanitized || typeof window === 'undefined') return;
  storageSanitized = true;

  const fallbackByKey: Record<string, string> = {
    meufreelas_user: '{}',
    meufreelas_users: '[]',
    meufreelas_projects: '[]',
    meufreelas_proposals: '[]',
    meufreelas_transactions: '[]',
    meufreelas_reports: '[]',
    meufreelas_saved_projects: '[]',
    meufreelas_sanctions: '[]',
    meufreelas_user_sanctions: '{}',
  };

  const isArrayPrefix = (k: string) =>
    k.startsWith('goals_') || k.startsWith('favorites_') || k.startsWith('notifications_');
  const isObjectPrefix = (k: string) => k.startsWith('profile_');

  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (!key) continue;
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;

      try {
        JSON.parse(raw);
      } catch {
        if (fallbackByKey[key] != null) {
          window.localStorage.setItem(key, fallbackByKey[key]);
        } else if (isArrayPrefix(key)) {
          window.localStorage.setItem(key, '[]');
        } else if (isObjectPrefix(key)) {
          window.localStorage.setItem(key, '{}');
        }
      }
    }
  } catch {
    // Ignora erros de acesso ao storage (ex.: modo restrito do navegador)
  }
}

function AppRoutes() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  sanitizeLocalStorageOnce();

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
