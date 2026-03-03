import { Users, Star, Briefcase, MessageSquare, UserPlus, UserMinus } from 'lucide-react';
import { useState } from 'react';

interface Client {
  id: number;
  name: string;
  company: string;
  rating: number;
  projects: number;
  avatar: string;
  isFollowing: boolean;
}

export default function ClientesSeguidos() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      name: 'Tech Solutions Ltda',
      company: 'Tecnologia',
      rating: 4.8,
      projects: 15,
      avatar: 'TS',
      isFollowing: true,
    },
    {
      id: 2,
      name: 'Marketing Digital Pro',
      company: 'Marketing',
      rating: 4.5,
      projects: 8,
      avatar: 'MP',
      isFollowing: true,
    },
    {
      id: 3,
      name: 'Design Studio',
      company: 'Design',
      rating: 4.9,
      projects: 23,
      avatar: 'DS',
      isFollowing: true,
    },
    {
      id: 4,
      name: 'E-commerce Brasil',
      company: 'Varejo',
      rating: 4.2,
      projects: 12,
      avatar: 'EB',
      isFollowing: false,
    },
    {
      id: 5,
      name: 'StartUp Inovadora',
      company: 'Tecnologia',
      rating: 4.7,
      projects: 6,
      avatar: 'SI',
      isFollowing: false,
    },
  ]);

  const toggleFollow = (id: number) => {
    setClients(clients.map(client =>
      client.id === id ? { ...client, isFollowing: !client.isFollowing } : client
    ));
  };

  const followedClients = clients.filter(c => c.isFollowing);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Clientes Seguidos</h1>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 bg-[#00a8cc] text-white rounded text-sm">
          Seguindo ({followedClients.length})
        </button>
        <button className="px-4 py-2 border border-[#ddd] rounded text-sm text-[#666] hover:bg-gray-50">
          Sugestões
        </button>
      </div>

      {/* Following List */}
      <div className="bg-white rounded shadow-sm">
        <div className="flex items-center gap-3 p-4 border-b border-[#e0e0e0] bg-gray-50">
          <Users className="w-5 h-5 text-[#00a8cc]" />
          <span className="font-medium text-[#333]">Clientes que você segue</span>
        </div>

        {followedClients.length > 0 ? (
          <div className="divide-y divide-[#e0e0e0]">
            {followedClients.map((client) => (
              <div key={client.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-[#00a8cc] flex items-center justify-center text-white font-bold">
                    {client.avatar}
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="font-semibold text-[#333]">{client.name}</h3>
                    <p className="text-sm text-[#666]">{client.company}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-[#666]">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#ff9800]" fill="#ff9800" />
                        {client.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {client.projects} projetos
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="p-2 text-[#00a8cc] hover:bg-blue-50 rounded transition-colors duration-200">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => toggleFollow(client.id)}
                    className="flex items-center gap-1 px-3 py-2 text-[#d9534f] hover:bg-red-50 rounded transition-colors duration-200"
                  >
                    <UserMinus className="w-4 h-4" />
                    Deixar de seguir
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-[#666]">Você ainda não segue nenhum cliente.</p>
            <p className="text-sm text-[#999]">Siga clientes para receber notificações de novos projetos.</p>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-[#333] mb-4">Sugestões para seguir</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients.filter(c => !c.isFollowing).map((client) => (
            <div key={client.id} className="bg-white rounded shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                  {client.avatar}
                </div>
                <div>
                  <h3 className="font-medium text-[#333]">{client.name}</h3>
                  <p className="text-xs text-[#666]">{client.company}</p>
                </div>
              </div>
              <button
                onClick={() => toggleFollow(client.id)}
                className="flex items-center gap-1 px-3 py-2 bg-[#00a8cc] hover:bg-[#0088aa] text-white text-sm rounded transition-colors duration-200"
              >
                <UserPlus className="w-4 h-4" />
                Seguir
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
