import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TopHeader from './sections/TopHeader';
import NavigationBar from './sections/NavigationBar';
import Footer from './sections/Footer';
import HelpButton from './sections/HelpButton';

// Pages
import Dashboard from './pages/Dashboard';
import BuscarProjetos from './pages/BuscarProjetos';
import BuscarFreelancers from './pages/BuscarFreelancers';
import MeusProjetos from './pages/MeusProjetos';
import ProjetosSalvos from './pages/ProjetosSalvos';
import ClientesSeguidos from './pages/ClientesSeguidos';
import PropostasPromovidas from './pages/PropostasPromovidas';
import EditarPerfil from './pages/EditarPerfil';
import EditarPortfolio from './pages/EditarPortfolio';
import ValidacaoIdentidade from './pages/ValidacaoIdentidade';
import Medalhas from './pages/Medalhas';
import HistoricoConexoes from './pages/HistoricoConexoes';
import EstoqueConexoes from './pages/EstoqueConexoes';
import CartoesCredito from './pages/CartoesCredito';
import ConfiguracoesAcesso from './pages/ConfiguracoesAcesso';
import ContaBancaria from './pages/ContaBancaria';
import HistoricoPagamentos from './pages/HistoricoPagamentos';
import HistoricoReembolsos from './pages/HistoricoReembolsos';
import InformacoesLocalizacao from './pages/InformacoesLocalizacao';
import MeusRendimentos from './pages/MeusRendimentos';
import MinhasAssinaturas from './pages/MinhasAssinaturas';
import NotificacoesAlertas from './pages/NotificacoesAlertas';
import VerificacoesDocumentos from './pages/VerificacoesDocumentos';
import CalculadoraFreelancer from './pages/CalculadoraFreelancer';
import FormatacaoTextos from './pages/FormatacaoTextos';
import FluxoProjeto from './pages/FluxoProjeto';
import ComoFunciona from './pages/ComoFunciona';
import CentralAjuda from './pages/CentralAjuda';
import Blog from './pages/Blog';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f0f3f5]">
        {/* Top Header */}
        <TopHeader />
        
        {/* Navigation Bar */}
        <NavigationBar />
        
        {/* Main Content */}
        <main className="py-5">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Projetos Routes */}
            <Route path="/buscar-projetos" element={<BuscarProjetos />} />
            <Route path="/meus-projetos" element={<MeusProjetos />} />
            <Route path="/minhas-propostas" element={<Navigate to="/" />} />
            <Route path="/propostas-promovidas" element={<PropostasPromovidas />} />
            <Route path="/projetos-salvos" element={<ProjetosSalvos />} />
            <Route path="/clientes-seguidos" element={<ClientesSeguidos />} />
            
            {/* Freelancers Routes */}
            <Route path="/buscar-freelancers" element={<BuscarFreelancers />} />
            
            {/* Perfil Routes */}
            <Route path="/editar-perfil" element={<EditarPerfil />} />
            <Route path="/meu-perfil" element={<Navigate to="/" />} />
            <Route path="/editar-portfolio" element={<EditarPortfolio />} />
            <Route path="/validacao-identidade" element={<ValidacaoIdentidade />} />
            <Route path="/medalhas" element={<Medalhas />} />
            <Route path="/historico-conexoes" element={<HistoricoConexoes />} />
            <Route path="/estoque-conexoes" element={<EstoqueConexoes />} />
            
            {/* Conta Routes */}
            <Route path="/cartoes-credito" element={<CartoesCredito />} />
            <Route path="/configuracoes-acesso" element={<ConfiguracoesAcesso />} />
            <Route path="/conta-bancaria" element={<ContaBancaria />} />
            <Route path="/historico-pagamentos" element={<HistoricoPagamentos />} />
            <Route path="/historico-reembolsos" element={<HistoricoReembolsos />} />
            <Route path="/informacoes-localizacao" element={<InformacoesLocalizacao />} />
            <Route path="/meus-rendimentos" element={<MeusRendimentos />} />
            <Route path="/minhas-assinaturas" element={<MinhasAssinaturas />} />
            <Route path="/notificacoes-alertas" element={<NotificacoesAlertas />} />
            <Route path="/verificacoes-documentos" element={<VerificacoesDocumentos />} />
            
            {/* Ferramentas Routes */}
            <Route path="/calculadora-freelancer" element={<CalculadoraFreelancer />} />
            <Route path="/formatacao-textos" element={<FormatacaoTextos />} />
            
            {/* Ajuda Routes */}
            <Route path="/fluxo-projeto" element={<FluxoProjeto />} />
            <Route path="/como-funciona" element={<ComoFunciona />} />
            <Route path="/central-ajuda" element={<CentralAjuda />} />
            <Route path="/blog" element={<Blog />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <Footer />
        
        {/* Help Button */}
        <HelpButton />
      </div>
    </Router>
  );
}

export default App;
