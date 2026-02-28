import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TurnstileWidget, hasTurnstile } from '@/components/TurnstileWidget';
import { Eye, EyeOff, Mail, Lock, User, Briefcase, ArrowRight } from 'lucide-react';
import { setSEO } from '@/lib/seo';

type UserTypeOption = 'freelancer' | 'client';

export default function Auth() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [userType, setUserType] = useState<UserTypeOption | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  useEffect(() => {
    setSEO({
      title: 'Autenticação - MeuFreelas',
      description: 'Entrar ou criar conta para contratar ou trabalhar.',
      canonicalPath: '/auth'
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
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
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!userType) {
      setError('Selecione um tipo de conta');
      return;
    }
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) { setError('Informe seu nome'); return; }
    if (!trimmedEmail) { setError('Informe seu email'); return; }
    if (password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres'); return; }
    if (password !== confirmPassword) { setError('As senhas não coincidem'); return; }
    setIsLoading(true);
    try {
      const result = await register(trimmedName, trimmedEmail, password, userType, turnstileToken || undefined);
      if (result.success && result.requiresActivation) {
        setSuccessMessage(result.message || 'Conta criada. Verifique seu e-mail para ativar.');
        return;
      }
      if (result.success) {
        const dest = userType === 'freelancer' ? '/freelancer/dashboard' : '/dashboard';
        navigate(dest, { replace: true });
      } else {
        setError(result.message || 'Este e-mail já possui conta ativa. Faça login.');
        setTab('login');
      }
    } catch {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-99dark py-4">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/" className="text-white text-2xl font-bold">
            meu<span className="font-light">freelas</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
          <div className="flex mb-6 border-b">
            <button className={`flex-1 py-2 ${tab==='login' ? 'border-b-2 border-99blue font-semibold' : ''}`} onClick={() => setTab('login')}>Entrar</button>
            <button className={`flex-1 py-2 ${tab==='register' ? 'border-b-2 border-99blue font-semibold' : ''}`} onClick={() => setTab('register')}>Cadastrar</button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6" role="alert">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6" role="status">
              {successMessage}
            </div>
          )}

          {hasTurnstile() && (
            <div className="mb-4">
              <TurnstileWidget
                onVerify={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken('')}
                theme="light"
              />
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-6" noValidate>
              <div>
                <label htmlFor="auth-email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input id="auth-email" type="email" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-99blue focus:border-transparent outline-none" placeholder="seu@email.com" required disabled={isLoading} />
                </div>
              </div>
              <div>
                <label htmlFor="auth-password" className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input id="auth-password" type={showPassword?'text':'password'} autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-99blue focus:border-transparent outline-none" placeholder="Sua senha" required disabled={isLoading} />
                  <button type="button" onClick={()=>setShowPassword(p=>!p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full py-3 bg-99blue text-white font-semibold rounded-lg hover:bg-99blue-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5" noValidate>
              <div className="space-y-4">
                <button type="button" onClick={()=>setUserType('client')} className={`w-full flex items-center p-4 border-2 rounded-lg transition-all text-left ${userType==='client'?'border-99blue bg-sky-50':'border-gray-200 hover:border-gray-300'}`}>
                  <div className={`p-3 rounded-lg mr-4 shrink-0 ${userType==='client' ? 'bg-99blue' : 'bg-gray-100'}`}>
                    <Briefcase className={`w-6 h-6 ${userType==='client' ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0"><p className={`font-medium ${userType==='client'?'text-99blue':'text-gray-800'}`}>Eu quero Contratar</p></div>
                  <input type="radio" name="userType" checked={userType==='client'} onChange={()=>setUserType('client')} className="w-5 h-5 text-99blue shrink-0" />
                </button>
                <button type="button" onClick={()=>setUserType('freelancer')} className={`w-full flex items-center p-4 border-2 rounded-lg transition-all text-left ${userType==='freelancer'?'border-99blue bg-sky-50':'border-gray-200 hover:border-gray-300'}`}>
                  <div className={`p-3 rounded-lg mr-4 shrink-0 ${userType==='freelancer' ? 'bg-99blue' : 'bg-gray-100'}`}>
                    <User className={`w-6 h-6 ${userType==='freelancer' ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0"><p className={`font-medium ${userType==='freelancer'?'text-99blue':'text-gray-800'}`}>Eu quero Trabalhar</p></div>
                  <input type="radio" name="userType" checked={userType==='freelancer'} onChange={()=>setUserType('freelancer')} className="w-5 h-5 text-99blue shrink-0" />
                </button>
              </div>
              <div>
                <label htmlFor="auth-name" className="block text-sm font-medium text-gray-700 mb-2">Nome completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input id="auth-name" type="text" autoComplete="name" value={name} onChange={(e)=>setName(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-99blue focus:border-transparent outline-none" placeholder="Seu nome completo" required disabled={isLoading} />
                </div>
              </div>
              <div>
                <label htmlFor="auth-email2" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input id="auth-email2" type="email" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-99blue focus:border-transparent outline-none" placeholder="seu@email.com" required disabled={isLoading} />
                </div>
              </div>
              <div>
                <label htmlFor="auth-pass2" className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input id="auth-pass2" type={showPassword?'text':'password'} autoComplete="new-password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-99blue focus:border-transparent outline-none" placeholder="Mínimo 6 caracteres" required minLength={6} disabled={isLoading} />
                  <button type="button" onClick={()=>setShowPassword(p=>!p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="auth-confirm" className="block text-sm font-medium text-gray-700 mb-2">Confirmar senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input id="auth-confirm" type={showPassword?'text':'password'} autoComplete="new-password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-99blue focus:border-transparent outline-none" placeholder="Confirme sua senha" required disabled={isLoading} />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full py-3 bg-99blue text-white font-semibold rounded-lg hover:bg-99blue-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
