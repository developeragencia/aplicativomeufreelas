import { useState } from 'react';
import { Camera, Save, User, Briefcase, GraduationCap, Heart, Wrench } from 'lucide-react';

export default function EditarPerfil() {
  const [activeTab, setActiveTab] = useState('info');

  const tabs = [
    { id: 'info', label: 'Informações Básicas', icon: User },
    { id: 'professional', label: 'Título Profissional', icon: Briefcase },
    { id: 'experience', label: 'Experiência', icon: GraduationCap },
    { id: 'interests', label: 'Áreas de Interesse', icon: Heart },
    { id: 'skills', label: 'Habilidades', icon: Wrench },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Editar Perfil</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
        {/* Sidebar */}
        <div className="bg-white rounded shadow-sm p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm rounded transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#00a8cc] text-white'
                    : 'text-[#666] hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded shadow-sm p-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#e0e0e0]">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#1a5f4a] flex items-center justify-center text-white text-3xl font-bold">
                H
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#00a8cc] hover:bg-[#0088aa] rounded-full flex items-center justify-center text-white transition-colors duration-200">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#333]">Hugo Carvana</h2>
              <p className="text-sm text-[#666]">Membro desde 2024</p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  defaultValue="Hugo Carvana"
                  className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  defaultValue="hugo@email.com"
                  className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">
                Título Profissional
              </label>
              <input
                type="text"
                placeholder="Ex: Desenvolvedor Full Stack"
                className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">
                Sobre Você
              </label>
              <textarea
                rows={5}
                placeholder="Descreva sua experiência e habilidades..."
                className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">
                  Localização
                </label>
                <input
                  type="text"
                  placeholder="São Paulo, SP"
                  className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc]"
                />
              </div>
            </div>

            <div className="pt-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-[#00a8cc] hover:bg-[#0088aa] text-white font-medium rounded transition-colors duration-200">
                <Save className="w-5 h-5" />
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
