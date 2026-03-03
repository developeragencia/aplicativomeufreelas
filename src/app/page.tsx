import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import TypewriterText from "@/components/TypewriterText";

const typewriterTexts = [
  "desenhar o seu website",
  "escrever o seu conteudo",
  "desenvolver o seu codigo",
  "melhorar o seu SEO",
  "desenhar o seu logotipo",
  "criar o seu video",
];

const stats = [
  { value: "136,807", label: "projetos concluidos" },
  { value: "3,405,902", label: "freelancers cadastrados" },
  { value: "R$26,348,091.79", label: "pago aos freelancers" },
];

const categories = [
  {
    title: "Desenhar o seu",
    highlight: "website",
    image: "https://ext.same-assets.com/2120427335/1405917825.jpeg",
    href: "/freelancers?categoria=web-mobile-e-software",
    color: "from-cyan-500/80",
  },
  {
    title: "Escrever o seu",
    highlight: "conteudo",
    image: "https://ext.same-assets.com/2120427335/1904798042.jpeg",
    href: "/freelancers?categoria=escrita",
    color: "from-pink-500/80",
  },
  {
    title: "Desenvolver o seu",
    highlight: "codigo",
    image: "https://ext.same-assets.com/2120427335/348272423.jpeg",
    href: "/freelancers?categoria=web-mobile-e-software",
    color: "from-purple-500/80",
  },
  {
    title: "Melhorar o seu",
    highlight: "SEO",
    image: "https://ext.same-assets.com/2120427335/3541932027.jpeg",
    href: "/freelancers?categoria=vendas-e-marketing",
    color: "from-blue-500/80",
  },
  {
    title: "Desenhar o seu",
    highlight: "logotipo",
    image: "https://ext.same-assets.com/2120427335/2472793749.png",
    href: "/freelancers?categoria=design-e-criacao",
    color: "from-pink-400/80",
  },
  {
    title: "Criar o seu",
    highlight: "video",
    image: "https://ext.same-assets.com/2120427335/1073371386.png",
    href: "/freelancers?categoria=fotografia-e-audiovisual",
    color: "from-amber-500/80",
  },
];

const howItWorks = [
  {
    icon: (
      <svg className="w-16 h-16 text-[#1bafe1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Publique uma vaga",
    description: "Publique a sua vaga para milhares de profissionais, voce ira receber propostas de freelancers talentosos em poucos minutos.",
  },
  {
    icon: (
      <svg className="w-16 h-16 text-[#1bafe1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Contrate",
    description: "Reveja o historico de trabalho, feedback de clientes e portfolio para limitar os candidatos. Entao faca uma entrevista pelo chat e escolha o melhor.",
  },
  {
    icon: (
      <svg className="w-16 h-16 text-[#1bafe1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Pague com seguranca",
    description: "Com o pagamento seguro do Meu Freelas, o pagamento sera repassado para o freelancer somente quando o projeto estiver concluido.",
  },
];

const testimonials = [
  {
    text: "Muito bom site para quem busca profissionais de diversos segmentos e especializacao. Depois que voce faz um projeto com esse site, voce se pergunta: como eu trabalhava sem esse site? Valeu muito a pena!",
    author: "Rafael Leite",
  },
  {
    text: "Dentre as plataformas de freelas, a 99 foi a que tem a maior base de respostas entre propostas de freelas. O nivel da base de dados de profissionais disponiveis e muito acima do esperado.",
    author: "Lincoln Tamashiro",
  },
  {
    text: "O Meu Freelas foi um achado. Ja conhecia o site ha certo tempo mas nao acreditava em sua eficiencia. Como tenho muitas demandas passei a ser um usuario permanente. Todas as propostas foram bem elaboradas.",
    author: "Jorge Medeiros",
  },
  {
    text: "Pela primeira vez que utilizei o site, tive uma excelente experiencia e com certeza recomendo o Meu Freelas pela rapidez no suporte ao usuario, seguranca no processo.",
    author: "Vanessa Custodio",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-[#5a6065]"
          style={{
            backgroundImage: `linear-gradient(rgba(71, 72, 77, 0.75), rgba(71, 72, 77, 0.75)), url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80')`,
          }}
        />

        {/* Nav Bar */}
        <div className="relative">
          <NavBar />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-5xl mx-auto px-4 py-20 md:py-32 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-light mb-8 leading-tight">
            Encontre o melhor <span className="hidden md:inline">profissional</span> freelancer
            <br />
            para <TypewriterText texts={typewriterTexts} />.
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/publicar-projeto"
              className="bg-[#1bafe1] text-white px-8 py-3 rounded font-medium hover:bg-[#2595cb] transition-colors text-lg"
            >
              Publicar projeto
            </Link>
            <Link
              href="/como-funciona"
              className="border-2 border-white text-white px-8 py-3 rounded font-medium hover:bg-white/10 transition-colors text-lg"
            >
              Quero Trabalhar
            </Link>
          </div>
        </div>
      </section>

      {/* Freelancer CTA */}
      <div className="bg-gray-100 py-3 text-center">
        <p className="text-gray-600">
          Voce e um freelancer? Junte-se a nos!{" "}
          <Link href="/cadastro/freelancer" className="text-[#1bafe1] font-medium hover:underline">
            Cadastre-se
          </Link>
          .
        </p>
      </div>

      {/* Statistics */}
      <section className="py-8 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="py-4">
                <div className="text-3xl md:text-4xl font-light text-[#1bafe1] mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-light text-center text-gray-800 mb-10">
            Encontre freelancers talentosos para...
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="relative group overflow-hidden rounded-lg aspect-[4/3]"
              >
                <Image
                  src={category.image}
                  alt={category.highlight}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} to-transparent`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <p className="text-lg">{category.title}</p>
                    <p className="text-2xl font-bold">{category.highlight}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/freelancers"
              className="inline-block border-2 border-[#1bafe1] text-[#1bafe1] px-6 py-2 rounded hover:bg-[#1bafe1] hover:text-white transition-colors"
            >
              Ver todas categorias
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#1bafe1] py-16 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-4">Como Funciona?</h2>
          <p className="text-center mb-12 opacity-90">
            Anuncie o seu trabalho facilmente, contrate freelancers e pague com seguranca.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4 bg-white rounded-full w-24 h-24 mx-auto items-center">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="opacity-90 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#1bafe1] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-light text-center text-white mb-10">
            O que nossos clientes estao dizendo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#2595cb] p-6 rounded-lg text-white"
              >
                <p className="text-sm mb-4 italic">&quot;{testimonial.text}&quot;</p>
                <p className="font-semibold">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-8">
            Esta pronto para encontrar o freelancer ideal para o seu projeto?
          </h2>
          <Link
            href="/publicar-projeto"
            className="inline-block bg-[#1bafe1] text-white px-8 py-4 rounded font-medium hover:bg-[#2595cb] transition-colors text-lg"
          >
            Anuncie uma vaga agora!
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
