import { Search, Book, MessageCircle, Phone, Mail, FileText, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const categories = [
  {
    title: 'Primeiros Passos',
    icon: Book,
    articles: [
      'Como criar uma conta',
      'Como completar meu perfil',
      'Como funciona o sistema de conexões',
      'Planos e preços',
    ],
  },
  {
    title: 'Para Freelancers',
    icon: FileText,
    articles: [
      'Como enviar propostas',
      'Como negociar com clientes',
      'Como receber pagamentos',
      'Como construir reputação',
    ],
  },
  {
    title: 'Para Clientes',
    icon: MessageCircle,
    articles: [
      'Como publicar um projeto',
      'Como escolher um freelancer',
      'Como fazer pagamentos',
      'Garantia de satisfação',
    ],
  },
  {
    title: 'Pagamentos',
    icon: FileText,
    articles: [
      'Formas de pagamento',
      'Taxas e comissões',
      'Reembolsos',
      'Notas fiscais',
    ],
  },
];

const popularArticles = [
  'Como funciona o sistema de conexões?',
  'Como receber pagamentos?',
  'Como cancelar minha assinatura?',
  'O que fazer se o freelancer não entregar?',
  'Como funciona a garantia de satisfação?',
];

export default function CentralAjuda() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#333] mb-4">Central de Ajuda</h1>
        <p className="text-lg text-[#666] max-w-2xl mx-auto mb-6">
          Encontre respostas para suas dúvidas ou entre em contato com nosso suporte
        </p>
        
        {/* Search */}
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por dúvidas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-[#ddd] rounded-lg focus:outline-none focus:border-[#00a8cc] text-lg"
          />
        </div>
      </div>

      {/* Popular Articles */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-[#333] mb-4">Artigos Populares</h2>
        <div className="bg-white rounded shadow-sm">
          {popularArticles.map((article, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center justify-between p-4 border-b border-[#e0e0e0] last:border-0 hover:bg-gray-50 transition-colors duration-200"
            >
              <span className="text-[#333]">{article}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </a>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {categories.map((category, index) => (
          <div key={index} className="bg-white rounded shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#00a8cc] rounded-full flex items-center justify-center">
                <category.icon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-[#333]">{category.title}</h2>
            </div>
            <ul className="space-y-2">
              {category.articles.map((article, articleIndex) => (
                <li key={articleIndex}>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-[#666] hover:text-[#00a8cc] transition-colors duration-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                    {article}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="bg-white rounded shadow-sm p-8">
        <h2 className="text-xl font-semibold text-[#333] mb-6 text-center">
          Ainda precisa de ajuda?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 border border-[#e0e0e0] rounded hover:border-[#00a8cc] transition-colors duration-200 cursor-pointer">
            <MessageCircle className="w-10 h-10 text-[#00a8cc] mx-auto mb-4" />
            <h3 className="font-semibold text-[#333] mb-2">Chat Online</h3>
            <p className="text-sm text-[#666]">Converse com nosso suporte em tempo real</p>
          </div>
          <div className="text-center p-6 border border-[#e0e0e0] rounded hover:border-[#00a8cc] transition-colors duration-200 cursor-pointer">
            <Mail className="w-10 h-10 text-[#00a8cc] mx-auto mb-4" />
            <h3 className="font-semibold text-[#333] mb-2">E-mail</h3>
            <p className="text-sm text-[#666]">suporte@99freelas.com.br</p>
          </div>
          <div className="text-center p-6 border border-[#e0e0e0] rounded hover:border-[#00a8cc] transition-colors duration-200 cursor-pointer">
            <Phone className="w-10 h-10 text-[#00a8cc] mx-auto mb-4" />
            <h3 className="font-semibold text-[#333] mb-2">Telefone</h3>
            <p className="text-sm text-[#666]">0800 123 4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}
