import { useState } from 'react';
import { Bell, Mail, MessageSquare, DollarSign, Star, Save } from 'lucide-react';

export default function NotificacoesAlertas() {
  const [settings, setSettings] = useState({
    email: {
      newProjects: true,
      newMessages: true,
      paymentReceived: true,
      proposalAccepted: true,
      newReviews: true,
      marketing: false,
    },
    push: {
      newProjects: true,
      newMessages: true,
      paymentReceived: true,
      proposalAccepted: false,
      newReviews: true,
      marketing: false,
    },
  });

  const toggleSetting = (type: 'email' | 'push', key: string) => {
    setSettings({
      ...settings,
      [type]: {
        ...settings[type],
        [key]: !settings[type][key as keyof typeof settings.email],
      },
    });
  };

  const notificationTypes = [
    { key: 'newProjects', label: 'Novos projetos', icon: Star },
    { key: 'newMessages', label: 'Novas mensagens', icon: MessageSquare },
    { key: 'paymentReceived', label: 'Pagamentos recebidos', icon: DollarSign },
    { key: 'proposalAccepted', label: 'Propostas aceitas', icon: Bell },
    { key: 'newReviews', label: 'Novas avaliações', icon: Star },
    { key: 'marketing', label: 'E-mails de marketing', icon: Mail },
  ];

  return (
    <div className="max-w-[800px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Notificações e Alertas</h1>
      
      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="bg-white rounded shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#333] mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#00a8cc]" />
            Notificações por E-mail
          </h2>
          
          <div className="space-y-3">
            {notificationTypes.map((type) => (
              <div
                key={type.key}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <type.icon className="w-5 h-5 text-[#666]" />
                  <span className="text-[#333]">{type.label}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.email[type.key as keyof typeof settings.email]}
                    onChange={() => toggleSetting('email', type.key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a8cc]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-white rounded shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#333] mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#00a8cc]" />
            Notificações Push
          </h2>
          
          <div className="space-y-3">
            {notificationTypes.map((type) => (
              <div
                key={type.key}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <type.icon className="w-5 h-5 text-[#666]" />
                  <span className="text-[#333]">{type.label}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.push[type.key as keyof typeof settings.push]}
                    onChange={() => toggleSetting('push', type.key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a8cc]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-6 py-3 bg-[#00a8cc] hover:bg-[#0088aa] text-white font-medium rounded transition-colors duration-200">
            <Save className="w-5 h-5" />
            Salvar Preferências
          </button>
        </div>
      </div>
    </div>
  );
}
