import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MapPin, Mail, Phone, Globe, Linkedin, Github, 
  Edit, Star, CheckCircle, Award, Briefcase, Clock,
  DollarSign, FileText, ArrowLeft, Shield, Crown,
  ThumbsUp, Share2, AlertTriangle, UserCheck
} from 'lucide-react';
import { apiListProjects, apiListProposals, apiListReviews, hasApi } from '@/lib/api';
import AppShell from '@/components/AppShell';

interface ProfileData {
  phone: string;
  location: string;
  bio: string;
  title: string;
  experience: string;
  hourlyRate: string;
  availability: string;
  website: string;
  linkedin: string;
  github: string;
  skills: Array<string>;
  languages: Array<string>;
}

export default function MyProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isFreelancer = user?.type === 'freelancer' || Boolean((user as { hasFreelancerAccount?: boolean })?.hasFreelancerAccount);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState({
    projectsCompleted: 0,
    recommendations: 0,
    rating: 0,
    ratingCount: 0,
    ranking: 0,
    memberSince: ''
  });

  useEffect(() => {
    if (!user?.id) return;

    const savedProfile = localStorage.getItem(`profile_${user.id}`);
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      // Normalize skills if they are objects
      if (parsed.skills && parsed.skills.length > 0 && typeof parsed.skills[0] === 'object') {
        parsed.skills = parsed.skills.map((s: any) => s.name || s.id);
      }
      setProfile(parsed);
    }

    const loadStats = async () => {
      try {
        if (hasApi()) {
          if (isFreelancer) {
            const [proposalsRes, reviewsRes] = await Promise.all([
              apiListProposals({ freelancerId: user.id }),
              apiListReviews(user.id),
            ]);
            const proposals = proposalsRes.ok && proposalsRes.proposals ? proposalsRes.proposals : [];
            const projectsCompleted = proposals.filter((p) => (p.status as string) === 'Aceita' || (p.status as string) === 'Concluída').length;
            
            let rating = user.rating || 0;
            let ratingCount = 0;
            if (reviewsRes.ok && reviewsRes.reviews) {
                ratingCount = reviewsRes.reviews.length;
                if (ratingCount > 0) {
                    const total = reviewsRes.reviews.reduce((sum, r) => sum + r.rating, 0);
                    rating = total / ratingCount;
                }
            }

            const memberSince = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
            
            setStats({ 
                projectsCompleted, 
                recommendations: Math.floor(projectsCompleted * 0.8), // Mock
                rating, 
                ratingCount, 
                ranking: projectsCompleted > 10 ? 150 : 2500, // Mock
                memberSince 
            });
            return;
          }
        }
        
        // Fallback / Client
        setStats({
            projectsCompleted: 0,
            recommendations: 0,
            rating: 5.0,
            ratingCount: 0,
            ranking: 0,
            memberSince: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
        });

      } catch (e) {
        console.error(e);
      }
    };

    void loadStats();
  }, [user, isFreelancer]);

  if (!user) return null;

  return (
    <AppShell wide>
      <div className="bg-gray-50 min-h-screen pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Back Link */}
          <div className="mb-6">
            <Link to="/freelancer/dashboard" className="text-99blue hover:underline flex items-center gap-1 text-sm font-medium">
              « Voltar ao Painel
            </Link>
          </div>

          {/* Main Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                
                {/* Avatar Section */}
                <div className="flex-shrink-0">
                  <div className="w-40 h-40 rounded-xl bg-gray-200 overflow-hidden border-4 border-white shadow-md relative group">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-5xl font-bold">
                        {user.name.substring(0, 1).toUpperCase()}
                      </div>
                    )}
                    <button 
                        onClick={() => navigate('/profile/edit')}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium"
                    >
                        Alterar Foto
                    </button>
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {(user.isPro || user.isPremium) && (
                           <Crown className="w-8 h-8 text-amber-500 fill-amber-100" />
                        )}
                        <h1 className="text-3xl font-bold text-gray-900 leading-tight">{user.name}</h1>
                        {user.isVerified && (
                          <Shield className="w-6 h-6 text-blue-500 fill-blue-50" />
                        )}
                        {(user.isPro || user.isPremium) && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                            TOP FREELANCER PLUS
                          </span>
                        )}
                      </div>
                      
                      <h2 className="text-xl text-gray-600 font-medium mb-3">
                        {profile?.title || 'Profissional Freelancer'}
                      </h2>

                      {/* Ratings */}
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

                      {/* Meta Stats */}
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
                    </div>

                    <div className="flex flex-col gap-3 flex-shrink-0">
                        <Link to="/profile/edit" className="px-6 py-2.5 bg-99blue text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-center">
                            Editar Perfil
                        </Link>
                        <button className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-center">
                            Visualizar como Público
                        </button>
                    </div>
                  </div>

                  {/* Medals / Badges */}
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
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600" title="Premium">
                        <Crown className="w-6 h-6" />
                    </div>
                    {/* Add more medals dynamically */}
                  </div>
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
                        {profile?.bio ? (
                            <p className="whitespace-pre-line leading-relaxed">{profile.bio}</p>
                        ) : (
                            <p className="text-gray-400 italic">Escreva sobre você para atrair mais clientes...</p>
                        )}
                    </div>
                </div>

                {/* Experience / Resume */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Resumo da experiência profissional:</h3>
                    <div className="prose prose-blue max-w-none text-gray-600">
                         {profile?.experience ? (
                            <p className="whitespace-pre-line leading-relaxed">{profile.experience}</p>
                        ) : (
                            <p className="text-gray-400 italic">Adicione sua experiência profissional...</p>
                        )}
                    </div>
                </div>

                {/* Portfolio (Placeholder) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Portfólio</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200">
                            <p className="text-sm">Nenhum item ainda</p>
                        </div>
                        {/* Map portfolio items here */}
                    </div>
                    <div className="mt-4 text-center">
                        <Link to="/portfolio/add" className="text-99blue font-medium hover:underline">Adicionar item ao portfólio</Link>
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
                                {profile?.location || 'Não informado'}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Disponibilidade</h4>
                            <p className="flex items-center gap-2 text-gray-700">
                                <Clock className="w-4 h-4 text-gray-400" />
                                {profile?.availability || 'Disponível'}
                            </p>
                        </div>
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
                            {profile?.phone ? (
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
                                <Link to="/verified-identity" className="text-99blue hover:underline">Verificar</Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Habilidades</h3>
                    <div className="flex flex-wrap gap-2">
                        {profile?.skills && profile.skills.length > 0 ? (
                            profile.skills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 italic">Nenhuma habilidade listada.</p>
                        )}
                    </div>
                </div>

                {/* Share Profile */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-2">Compartilhar Perfil</h3>
                    <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm">
                            <Linkedin className="w-4 h-4" /> LinkedIn
                        </button>
                        <button className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm">
                            <Share2 className="w-4 h-4" /> Copiar
                        </button>
                    </div>
                </div>

            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
