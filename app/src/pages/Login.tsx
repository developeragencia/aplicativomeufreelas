import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiResendActivation, hasApi, apiOAuthStart, apiOAuthComplete } from '../lib/api';
import { Eye, EyeOff, Mail, Lock, Github, Chrome } from 'lucide-react';
import { setSEO } from '../lib/seo';
import { TurnstileWidget, hasTurnstile } from '@/components/TurnstileWidget';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [notVerifiedEmail, setNotVerifiedEmail] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setNotVerifiedEmail(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Preencha email e senha.');
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await login(trimmedEmail, password, turnstileToken || undefined);
      if (result.success) {
        const stored = localStorage.getItem('meufreelas_user');
        const u = stored ? (JSON.parse(stored) as { type?: string }) : null;
        const dest = u?.type === 'freelancer' ? '/freelancer/dashboard' : '/dashboard';
        navigate(dest, { replace: true });
      } else {
        setError(result.error || 'Email ou senha incorretos.');
        if (result.code === 'NOT_VERIFIED') setNotVerifiedEmail(trimmedEmail);
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendActivation = async () => {
    const emailToUse = notVerifiedEmail ?? email.trim();
    if (!emailToUse) return;
    setError('');
    setSuccessMessage('');
    setIsResendLoading(true);
    try {
      if (hasApi()) {
        const res = await apiResendActivation(emailToUse);
        if (res.ok) {
          setSuccessMessage(res.message || 'E-mail de ativação reenviado. Verifique sua caixa de entrada e o spam.');
        } else {
          setError(res.error || 'Não foi possível reenviar o e-mail.');
        }
      } else {
        setError('Reenvio de e-mail não disponível neste modo.');
      }
    } catch {
      setError('Erro ao reenviar. Tente novamente.');
    } finally {
      setIsResendLoading(false);
    }
  };

  const startOAuth = async (provider: 'google' | 'github') => {
    setError('');
    const res = await apiOAuthStart(provider);
    if (res.ok && res.url) window.location.href = res.url;
    else setError(res.error || 'Falha ao iniciar login social.');
  };

  useEffect(() => {
    setSEO({
      title: 'Login - MeuFreelas',
      description: 'Entre na sua conta para contratar ou trabalhar.',
      canonicalPath: '/login'
    });
  }, []);

  useEffect(() => {
    const usp = new URLSearchParams(window.location.search);
    const oauthEmail = usp.get('oauth_email');
    if (oauthEmail) {
      apiOAuthComplete(oauthEmail).then((res) => {
        if (res.ok && res.user) {
          const ok = (useAuth() as any).setAuthenticated(res.user);
          if (ok) {
            const stored = localStorage.getItem('meufreelas_user');
            const u = stored ? (JSON.parse(stored) as { type?: string }) : null;
            const dest = u?.type === 'freelancer' ? '/freelancer/dashboard' : '/dashboard';
            navigate(dest, { replace: true });
          }
        }
      }).catch(() => {});
    }
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-99dark py-4">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/" className="text-white text-2xl font-bold">
            meu<span className="font-light">freelas</span>
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">
            Login
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Entre na sua conta para continuar
          </p>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button type="button" onClick={()=>startOAuth('google')} className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Chrome className="w-5 h-5 mr-3 text-rose-500" />
              Entrar com Google
            </button>
            <button type="button" onClick={()=>startOAuth('github')} className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Github className="w-5 h-5 mr-3" />
              Entrar com GitHub
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6" role="alert" aria-live="assertive">
              {error}
              {notVerifiedEmail && hasApi() && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleResendActivation}
                    disabled={isResendLoading}
                    className="text-sm font-medium text-99blue hover:underline disabled:opacity-50"
                  >
                    {isResendLoading ? 'Enviando...' : 'Reenviar e-mail de ativação'}
                  </button>
                </div>
              )}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6" role="status" aria-live="polite">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {hasTurnstile() && (
              <div className="mb-2">
                <TurnstileWidget
                  onVerify={(token) => setTurnstileToken(token)}
                  onExpire={() => setTurnstileToken('')}
                  theme="light"
                />
              </div>
            )}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-99blue focus:border-transparent outline-none"
                  placeholder="seu@email.com"
                  required
                  aria-describedby="login-email-desc"
                  disabled={isLoading}
                />
                <p id="login-email-desc" className="mt-1 text-xs text-gray-500">Campo obrigatório</p>
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-99blue focus:border-transparent outline-none"
                  placeholder="Sua senha"
                  required
                  aria-describedby="login-password-desc"
                  disabled={isLoading}
                />
                <p id="login-password-desc" className="mt-1 text-xs text-gray-500">Campo obrigatório</p>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center cursor-pointer">
                <input id="remember-me" type="checkbox" className="w-4 h-4 text-99blue border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">Lembrar-me</label>
              </div>
              <Link to="/forgot-password" className="text-sm text-99blue hover:underline">
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-99blue text-white font-semibold rounded-lg hover:bg-99blue-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-99blue hover:underline font-medium">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
