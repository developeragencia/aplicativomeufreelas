import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, Briefcase, Check, ChevronDown, Globe, Lock, 
  Paperclip, X, Layout, FileText, DollarSign, Clock, AlertCircle 
} from 'lucide-react';
import { getSortedSkills } from '@/constants/skills';
import { setSEO } from '@/lib/seo';
import { apiCreateProject, hasApi } from '@/lib/api';
import AppShell from '@/components/AppShell';

const categories = [
  'Administração & Contabilidade',
  'Advogados & Leis',
  'Atendimento ao Consumidor',
  'Design & Criação',
  'Educação & Consultoria',
  'Engenharia & Arquitetura',
  'Escrita',
  'Fotografia & Audiovisual',
  'Suporte Administrativo',
  'Tradução',
  'Vendas & Marketing',
  'Web, Mobile & Software',
  'Outra Categoria',
];

const experienceLevels = [
  { id: 'beginner', label: 'Iniciante', description: 'Profissionais em início de carreira, valores mais acessíveis.' },
  { id: 'intermediate', label: 'Intermediário', description: 'Equilíbrio entre experiência e custo.' },
  { id: 'expert', label: 'Especialista', description: 'Profissionais altamente qualificados para projetos complexos.' },
];

const proposalDays = [
  { value: '7', label: '7 dias' },
  { value: '14', label: '14 dias' },
  { value: '30', label: '30 dias' },
  { value: '60', label: '60 dias' },
];

export default function NewProject() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const skillsDropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    selectedSkills: [] as string[],
    experienceLevel: 'intermediate',
    proposalDays: '30',
    visibility: 'public' as 'public' | 'private',
    budget: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const allSkills = getSortedSkills();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (skillsDropdownRef.current && !skillsDropdownRef.current.contains(event.target as Node)) {
        setShowSkillsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSEO({
      title: 'Publicar Projeto - MeuFreelas',
      description: 'Crie um novo projeto e receba propostas de freelancers.',
      canonicalPath: '/project/new'
    });
  }, []);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.type !== 'client' && !user?.hasClientAccount) return <Navigate to="/freelancer/dashboard" replace />;

  const filteredSkills = allSkills.filter(
    (skill) => skill.toLowerCase().includes(skillSearch.toLowerCase()) && !formData.selectedSkills.includes(skill)
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const total = [...files, ...selected].slice(0, 5);
    setFiles(total);
  };

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const addSkill = (skill: string) => {
    if (formData.selectedSkills.length >= 5 || formData.selectedSkills.includes(skill)) return;
    setFormData((prev) => ({ ...prev, selectedSkills: [...prev.selectedSkills, skill] }));
    setSkillSearch('');
    setShowSkillsDropdown(false);
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({ ...prev, selectedSkills: prev.selectedSkills.filter((s) => s !== skill) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.category) { setErrorMessage('Selecione uma categoria.'); return; }
    if (formData.title.trim().length < 10) { setErrorMessage('O título deve ter pelo menos 10 caracteres.'); return; }
    if (formData.description.trim().length < 30) { setErrorMessage('A descrição deve ter pelo menos 30 caracteres.'); return; }

    setIsSubmitting(true);
    
    try {
      const payload = {
        userId: user!.id,
        category: formData.category,
        title: formData.title.trim(),
        description: formData.description.trim(),
        skills: formData.selectedSkills,
        experienceLevel: formData.experienceLevel,
        proposalDays: formData.proposalDays,
        visibility: formData.visibility,
        budget: formData.budget // Send budget if API supports it
      };

      if (hasApi()) {
        const res = await apiCreateProject(payload);
        if (!res.ok) throw new Error(res.error || 'Erro ao publicar projeto');
      }

      // Fallback logic for demo/local storage if needed (removed for brevity as we focus on API)
      
      navigate('/my-projects');
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocorreu um erro inesperado.');
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Publicar novo projeto</h1>
            <p className="text-gray-500 mt-2">Descreva sua necessidade e receba propostas de especialistas.</p>
          </div>

          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Passo 1: O que você precisa? */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <Layout className="w-5 h-5 text-gray-500" />
                <h2 className="font-semibold text-gray-900">1. O que você precisa?</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título do Projeto</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Desenvolvedor React para E-commerce"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">{formData.title.length}/100</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Selecione...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Passo 2: Detalhes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <h2 className="font-semibold text-gray-900">2. Detalhes do Projeto</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva os requisitos, responsabilidades e objetivos..."
                    rows={6}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    maxLength={5000}
                  />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-500">Não inclua contatos pessoais.</p>
                    <p className="text-xs text-gray-500">{formData.description.length}/5000</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Habilidades Desejadas</label>
                  <div className="relative" ref={skillsDropdownRef}>
                    <div className="flex flex-wrap gap-2 mb-2 p-2 border border-gray-300 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
                      {formData.selectedSkills.map((skill) => (
                        <span key={skill} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm flex items-center gap-1">
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)} className="hover:text-blue-900"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={skillSearch}
                        onChange={(e) => { setSkillSearch(e.target.value); setShowSkillsDropdown(true); }}
                        onFocus={() => setShowSkillsDropdown(true)}
                        placeholder={formData.selectedSkills.length === 0 ? "Digite para buscar skills..." : ""}
                        className="flex-1 outline-none min-w-[120px] bg-transparent text-sm"
                      />
                    </div>
                    {showSkillsDropdown && filteredSkills.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredSkills.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => addSkill(skill)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Anexos</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Clique para adicionar arquivos (PDF, Imagens)</p>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple className="hidden" />
                  </div>
                  {files.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {files.map((file, idx) => (
                        <li key={idx} className="flex items-center justify-between text-sm bg-white p-2 border border-gray-200 rounded">
                          <span className="truncate max-w-[200px]">{file.name}</span>
                          <button type="button" onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Passo 3: Preferências */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-gray-500" />
                <h2 className="font-semibold text-gray-900">3. Preferências</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nível de Experiência</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {experienceLevels.map((level) => (
                      <div 
                        key={level.id}
                        onClick={() => setFormData({ ...formData, experienceLevel: level.id })}
                        className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                          formData.experienceLevel === level.id 
                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900 mb-1">{level.label}</div>
                        <div className="text-xs text-gray-500 leading-relaxed">{level.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duração da Publicação</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        value={formData.proposalDays}
                        onChange={(e) => setFormData({ ...formData, proposalDays: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
                      >
                        {proposalDays.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visibilidade</label>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, visibility: 'public' })}
                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-all ${
                          formData.visibility === 'public' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Globe className="w-4 h-4" /> Público
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, visibility: 'private' })}
                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-all ${
                          formData.visibility === 'private' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Lock className="w-4 h-4" /> Privado
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <Link to="/dashboard" className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 bg-99blue text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-blue-200 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Publicando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Publicar Projeto
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </AppShell>
  );
}
