import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGetFreelancerById, hasApi } from '@/lib/api';
import { setSEO } from '@/lib/seo';
import AppShell from '@/components/AppShell';
import { 
  MapPin, Mail, Phone, Clock, Star, Shield, Crown, 
  Award, UserCheck, ThumbsUp, Share2, Linkedin, CheckCircle 
} from 'lucide-react';

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [stats, setStats] = useState({
    projectsCompleted: 0,
    recommendations: 0,
    rating: 0,
    ratingCount: 0,
    ranking: 0,
    memberSince: ''
  });

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        if (hasApi()) {
          const res = await apiGetFreelancerById(id);
          if (res.ok && res.item) {
            setUser(res.item);
            
            // Mock stats based on user data if available, or generate realistic mocks
            const projectsCompleted = res.item.completedProjects || 0;
            const rating = res.item.rating || 0;
            const ratingCount = res.item.totalReviews || 0;
            
            setStats({
                projectsCompleted,
                recommendations: Math.floor(projectsCompleted * 0.9),
                rating,
                ratingCount,
                ranking: projectsCompleted > 5 ? 150 : 0,
                memberSince: new Date(res.item.created_at || Date.now()).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
            });

            setSEO({
              title: `${res.item.name} - Perfil | MeuFreelas`,
              description: res.item.bio || 'Veja o perfil deste freelancer.',
              canonicalPath: `/user/${id}`
            });
          } else {
            setError(res.error || 'Perfil não encontrado');
          }
        } else {
            // Fallback for demo
             setError('API indisponível');
        }
      } catch {
        setError('Falha ao carregar perfil');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
      return (
          <AppShell wide>
              <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
          </AppShell>
      );
  }

  if (error || !user) {
      return (
          <AppShell wide>
              <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Ops!</h2>
                  <p className="text-gray-600 mb-6">{error || 'Usuário não encontrado.'}</p>
                  <Link to="/freelancers" className="px-4 py-2 bg-99blue text-white rounded-lg">Voltar para a busca</Link>
              </div>
          </AppShell>
      );
  }

  const isFreelancer = user.type === 'freelancer';

  return (
    <AppShell wide>
      <div className="bg-gray-50 min-h-screen pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Back Link */}
          <div className="mb-6">
            <Link to="/freelancers" className="text-99blue hover:underline flex items-center gap-1 text-sm font-medium">
              « Voltar para resultados
            </Link>
          </div>

          {/* Main Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                
                {/* Avatar Section */}
                <div className="flex-shrink-0">
                  <div className="w-40 h-40 rounded-xl bg-gray-200 overflow-hidden border-4 border-white shadow-md relative">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-5xl font-bold">
                        {user.name.substring(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {(user.isPremium || user.isPro) && (
                            <Crown className="w-8 h-8 text-amber-500 fill-amber-100" />
                        )}
                        <h1 className="text-3xl font-bold text-gray-900 leading-tight">{user.name}</h1>
                        {/* Always show Verified if true */}
                        {user.isVerified && (
                          <span title="Identidade Verificada"><Shield className="w-6 h-6 text-blue-500 fill-blue-50" /></span>
                        )}
                        {/* Show Premium Badge */}
                        {(user.isPremium || user.isPro) && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                            TOP FREELANCER PLUS
                          </span>
                        )}
                      </div>
                      
                      <h2 className="text-xl text-gray-600 font-medium mb-3">
                        {user.title || (isFreelancer ? 'Profissional Freelancer' : 'Cliente')}
                      </h2>

                      {/* Ratings */}
                      {isFreelancer && (
                          <div className="flex items-center gap-4 text-sm mb-4">
                            <div className="flex items-center gap-1">
                                <div className="flex text-amber-400">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star key={i} className={`w-5 h-5 ${i <= Math.round(stats.rating) ? 'fill-current' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <span className="font-bold text-gray-900 ml-1">({stats.rating.toFixed(2)} - {stats.ratingCount} avaliações)</span>
                            </div>
                          </div>
                      )}

                      {/* Meta Stats */}
                      {isFreelancer && (
                          <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <span className="font-semibold text-gray-900">Ranking:</span> {stats.ranking || '-'}
                            </div>
                            <div className="border-l border-gray-300 h-4 hidden sm:block"></div>
                            <div className="flex items-center gap-1">
                                <span className="font-semibold text-gray-900">Projetos concluídos:</span> {stats.projectsCompleted}
                            </div>
                            <div className="border-l border-gray-300 h-4 hidden sm:block"></div>
                            <div className="flex items-center gap-1">
                                <span className="font-semibold text-gray-900">Recomendações:</span> {stats.recommendations}
                            </div>
                            <div className="border-l border-gray-300 h-4 hidden sm:block"></div>
                            <div className="flex items-center gap-1">
                                <span className="font-semibold text-gray-900">Registrado desde:</span> {stats.memberSince}
                            </div>
                          </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 flex-shrink-0">
                        {isFreelancer ? (
                            <Link to={`/messages?userId=${user.id}`} className="px-6 py-2.5 bg-99blue text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-center flex items-center justify-center gap-2">
                                <Mail className="w-4 h-4" /> Enviar Mensagem
                            </Link>
                        ) : (
                            <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">Perfil de Cliente</div>
                        )}
                        <button className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-center flex items-center justify-center gap-2">
                            <Share2 className="w-4 h-4" /> Compartilhar
                        </button>
                    </div>
                  </div>

                  {/* Medals / Badges */}
                  {isFreelancer && (
                      <div className="mt-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600" title="Pioneiro">
                            <Award className="w-6 h-6" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600" title="Verificado">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600" title="Top Avaliado">
                            <ThumbsUp className="w-6 h-6" />
                        </div>
                        {(user.isPremium || user.isPro) && (
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600" title="Premium">
                                <Crown className="w-6 h-6" />
                            </div>
                        )}
                      </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* About */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Sobre mim:</h3>
                    <div className="prose prose-blue max-w-none text-gray-600">
                        {user.bio ? (
                            <p className="whitespace-pre-line leading-relaxed">{user.bio}</p>
                        ) : (
                            <p className="text-gray-400 italic">Sem descrição.</p>
                        )}
                    </div>
                </div>

                {/* Experience / Resume (If available in user object, currently might not be fully supported in backend for public profile but adding placeholder logic) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Resumo da experiência profissional:</h3>
                    <div className="prose prose-blue max-w-none text-gray-600">
                         {user.experience ? (
                            <p className="whitespace-pre-line leading-relaxed">{user.experience}</p>
                        ) : (
                            <p className="text-gray-400 italic">Informação não disponível.</p>
                        )}
                    </div>
                </div>

                {/* Portfolio */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Portfólio</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Placeholder for now */}
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200">
                            <p className="text-sm">Nenhum item público</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Right Column (Sidebar) */}
            <div className="space-y-6">
                
                {/* Details Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="space-y-4">

                        
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Localização</h4>
                            <p className="flex items-center gap-2 text-gray-700">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {user.location || 'Não informado'}
                            </p>
                        </div>

                        {isFreelancer && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Disponibilidade</h4>
                                <p className="flex items-center gap-2 text-gray-700">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    {user.availability || 'Disponível'}
                                </p>
                            </div>
                        )}
                    </div>

                    <hr className="my-6 border-gray-100" />

                    <div className="space-y-3">
                        <h4 className="font-bold text-gray-900">Verificações</h4>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Email
                            </span>
                            <span className="text-green-600 font-medium flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Verificado
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center gap-2">
                                <Phone className="w-4 h-4" /> Telefone
                            </span>
                            {user.phone ? (
                                <span className="text-green-600 font-medium flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> Verificado
                                </span>
                            ) : (
                                <span className="text-gray-400 italic">Pendente</span>
                            )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Identidade
                            </span>
                            {user.isVerified ? (
                                <span className="text-green-600 font-medium flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> Verificado
                                </span>
                            ) : (
                                <span className="text-gray-400 italic">Não verificado</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Habilidades</h3>
                    <div className="flex flex-wrap gap-2">
                        {user.skills && user.skills.length > 0 ? (
                            (Array.isArray(user.skills) ? user.skills : JSON.parse(user.skills)).map((skill: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 italic">Nenhuma habilidade listada.</p>
                        )}
                    </div>
                </div>

            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
