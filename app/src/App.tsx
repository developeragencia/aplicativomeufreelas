import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects';
import Freelancers from './pages/Freelancers';
import NewProject from './pages/NewProject';
import HowItWorks from './pages/HowItWorks';
import ProjectDetail from './pages/ProjectDetail';
import Status from './pages/Status';
import UserProfile from './pages/UserProfile';
import HelpCenter from './pages/HelpCenter';
import MyProjects from './pages/MyProjects';
import MyProposals from './pages/MyProposals';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import AdminRoute from './components/AdminRoute';
import Plans from './pages/Plans';
import VerifiedIdentity from './pages/VerifiedIdentity';
import Disputes from './pages/Disputes';
import AdminModeration from './pages/AdminModeration';
import Invitations from './pages/Invitations';
import Notifications from './pages/Notifications';
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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/project/:id" element={<ProjectDetail />} />
      <Route path="/freelancers" element={<Freelancers />} />
      <Route path="/user/:id" element={<UserProfile />} />
      <Route path="/ajuda" element={<HelpCenter />} />
      <Route path="/project/new" element={<NewProject />} />
      <Route path="/my-projects" element={<MyProjects />} />
      <Route path="/my-proposals" element={<MyProposals />} />
      <Route path="/como-funciona" element={<HowItWorks />} />
      <Route path="/status" element={<Status />} />
      <Route path="/dashboard" element={<ClientDashboard />} />
      <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/verified" element={<VerifiedIdentity />} />
      <Route path="/disputes" element={<Disputes />} />
      <Route path="/admin/moderation" element={<AdminRoute><AdminModeration /></AdminRoute>} />
      <Route path="/invitations" element={<Invitations />} />
      <Route path="/notifications" element={<Notifications />} />
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
          <HashClean />
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

function HashClean() {
  const navigate = useNavigate();
  if (typeof window !== 'undefined' && window.location.hash) {
    const h = window.location.hash;
    if (h && h.indexOf('#/') === 0) {
      const target = h.substring(1);
      navigate(target, { replace: true });
    } else {
      try {
        window.history.replaceState(null, '', window.location.pathname);
      } catch {}
    }
  }
  return null;
}
