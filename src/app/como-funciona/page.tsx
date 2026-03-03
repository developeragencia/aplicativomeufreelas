import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const stepsClients = [
  {
    number: "1",
    title: "Publique seu projeto",
    description: "Descreva o que voce precisa e receba propostas de freelancers qualificados em minutos.",
  },
  {
    number: "2",
    title: "Escolha o melhor freelancer",
    description: "Analise portfolios, avaliacoes e historico de trabalho para encontrar o profissional ideal.",
  },
  {
    number: "3",
    title: "Pague com seguranca",
    description: "Seu pagamento fica protegido ate voce aprovar o trabalho entregue.",
  },
];

const stepsFreelancers = [
  {
    number: "1",
    title: "Crie seu perfil",
    description: "Cadastre-se gratuitamente e mostre suas habilidades, portfolio e experiencia.",
  },
  {
    number: "2",
    title: "Encontre projetos",
    description: "Busque projetos que combinam com suas habilidades e envie propostas.",
  },
  {
    number: "3",
    title: "Trabalhe e receba",
    description: "Entregue o projeto e receba seu pagamento de forma segura e garantida.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-[#1bafe1] py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-light mb-4">Como Funciona</h1>
          <p className="text-xl opacity-90">
            Conectamos empresas aos melhores freelancers do Brasil
          </p>
        </div>
      </section>

      <main className="flex-1">
        {/* For Clients */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-light text-center text-gray-800 mb-4">
              Para Empresas
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Contrate os melhores profissionais para o seu projeto
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stepsClients.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-[#1bafe1] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/publicar-projeto"
                className="inline-block bg-[#1bafe1] text-white px-8 py-3 rounded font-medium hover:bg-[#2595cb] transition-colors"
              >
                Publicar um projeto
              </Link>
            </div>
          </div>
        </section>

        {/* For Freelancers */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-light text-center text-gray-800 mb-4">
              Para Freelancers
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Encontre projetos e trabalhe de qualquer lugar
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stepsFreelancers.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-[#2eadaa] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/cadastro"
                className="inline-block bg-[#2eadaa] text-white px-8 py-3 rounded font-medium hover:bg-[#259b98] transition-colors"
              >
                Cadastrar como freelancer
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-light text-center text-gray-800 mb-12">
              Por que usar o Meu Freelas?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-12 h-12 text-[#1bafe1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Pagamento Seguro
                  </h3>
                  <p className="text-gray-600">
                    Seu dinheiro fica protegido ate voce aprovar o trabalho entregue.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-12 h-12 text-[#1bafe1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Milhares de Profissionais
                  </h3>
                  <p className="text-gray-600">
                    Acesse uma base com mais de 3 milhoes de freelancers qualificados.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-12 h-12 text-[#1bafe1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Rapidez
                  </h3>
                  <p className="text-gray-600">
                    Receba propostas em minutos apos publicar seu projeto.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-12 h-12 text-[#1bafe1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Sem Taxa de Cadastro
                  </h3>
                  <p className="text-gray-600">
                    Publique projetos e cadastre-se como freelancer gratuitamente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#1bafe1] text-white text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-light mb-6">
              Pronto para comecar?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/publicar-projeto"
                className="bg-white text-[#1bafe1] px-8 py-3 rounded font-medium hover:bg-gray-100 transition-colors"
              >
                Publicar projeto
              </Link>
              <Link
                href="/cadastro"
                className="border-2 border-white text-white px-8 py-3 rounded font-medium hover:bg-white/10 transition-colors"
              >
                Cadastrar-se
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
