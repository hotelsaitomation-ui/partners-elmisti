import Link from "next/link";
import { getPartners } from "@/lib/partners";
import SmartForm from "@/components/SmartForm";

export default async function HomePage() {
  const parceiros = await getPartners();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-misti-navy py-4 px-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-heading font-bold text-xl text-white">
            El Misti Hostels
          </span>
          <nav className="flex items-center gap-6">
            <a
              href="#por-que"
              className="text-white/70 hover:text-white text-sm transition-colors hidden sm:inline"
            >
              Por que?
            </a>
            <a
              href="#valores"
              className="text-white/70 hover:text-white text-sm transition-colors hidden sm:inline"
            >
              Valores
            </a>
            <a
              href="#candidatar"
              className="bg-misti-orange hover:bg-misti-orange-dark text-white text-sm font-heading font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Quero ser parceiro
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-misti-navy via-misti-navy to-misti-teal overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-misti-orange rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-misti-teal rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 py-24 md:py-32 text-center">
          <div className="inline-block bg-misti-orange/20 text-misti-orange-light font-heading text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Programa de Parceiros
          </div>
          <h1 className="font-heading font-bold text-4xl md:text-6xl text-white leading-tight mb-6">
            Sua voz. Nossa casa.
            <br />
            <span className="text-misti-orange">Uma parceria real.</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            O El Misti nao busca numeros. Buscamos pessoas que compartilham
            nossos valores &mdash; autenticidade, comunidade e a paixao por
            viajar de verdade.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#candidatar"
              className="bg-misti-orange hover:bg-misti-orange-dark text-white font-heading font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Quero fazer parte
            </a>
            <a
              href="#por-que"
              className="text-white/70 hover:text-white font-heading text-lg px-8 py-4 transition-colors"
            >
              Saiba mais
            </a>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="bg-misti-gray-warm py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="font-heading font-bold text-3xl text-misti-navy">
              12+
            </p>
            <p className="text-gray-500 text-sm mt-1">anos de historia</p>
          </div>
          <div>
            <p className="font-heading font-bold text-3xl text-misti-teal">
              4
            </p>
            <p className="text-gray-500 text-sm mt-1">
              propriedades no Brasil
            </p>
          </div>
          <div>
            <p className="font-heading font-bold text-3xl text-misti-orange">
              9.0+
            </p>
            <p className="text-gray-500 text-sm mt-1">nota no Booking</p>
          </div>
          <div>
            <p className="font-heading font-bold text-3xl text-misti-navy">
              50k+
            </p>
            <p className="text-gray-500 text-sm mt-1">hospedes por ano</p>
          </div>
        </div>
      </section>

      {/* Por que ser parceiro? */}
      <section id="por-que" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-misti-navy mb-4">
              Por que ser parceiro El Misti?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Mais do que um codigo de desconto &mdash; e fazer parte de uma
              comunidade que valoriza experiencias autenticas.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-misti-orange/10 rounded-xl flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-misti-orange"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-xl text-misti-navy mb-3">
                Codigo exclusivo
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Seu proprio codigo de desconto personalizado para compartilhar
                com sua audiencia.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-misti-teal/10 rounded-xl flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-misti-teal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-xl text-misti-navy mb-3">
                Comunidade real
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Faca parte de uma rede de criadores que valorizam viagem com
                proposito e conexao humana.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-misti-navy/10 rounded-xl flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-misti-navy"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-xl text-misti-navy mb-3">
                Experiencia unica
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Hospedagem em localizacoes privilegiadas &mdash; Ipanema,
                Copacabana, Centro do Rio e Salvador.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section id="valores" className="py-20 px-4 bg-misti-navy">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
              Nao e sobre numeros.
              <br />E sobre{" "}
              <span className="text-misti-orange">valores</span>.
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Preferimos um perfil pequeno e engajado, com conteudo autentico,
              a um grande com os valores errados.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-misti-teal/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <svg
                    className="w-5 h-5 text-misti-teal"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white mb-2">
                    Autenticidade
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    Seu conteudo reflete quem voce realmente e. Sem scripts,
                    sem falsidade.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-misti-teal/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <svg
                    className="w-5 h-5 text-misti-teal"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white mb-2">
                    Engajamento real
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    Sua comunidade interage de verdade. Comentarios reais valem
                    mais que milhoes de seguidores fantasmas.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-misti-teal/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <svg
                    className="w-5 h-5 text-misti-teal"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white mb-2">
                    Paixao por viagem
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    Voce viaja porque ama, nao so porque &quot;gera
                    conteudo&quot;. Essa energia transparece.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-misti-teal/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <svg
                    className="w-5 h-5 text-misti-teal"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white mb-2">
                    Respeito e diversidade
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    O Misti recebe o mundo inteiro. Buscamos parceiros que
                    celebram a diversidade.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de candidatura */}
      <section
        id="candidatar"
        className="py-20 px-4 bg-gradient-to-b from-white to-misti-gray-warm"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-misti-navy mb-4">
              Pronto para fazer parte?
            </h2>
            <p className="text-gray-600 text-lg">
              Preencha o formulario abaixo. Analisaremos seu perfil com
              carinho e retornaremos em breve.
            </p>
          </div>
          <SmartForm />
        </div>
      </section>

      {/* Parceiros atuais (social proof) */}
      {parceiros.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-heading font-bold text-3xl text-misti-navy mb-4">
                Quem ja faz parte
              </h2>
              <p className="text-gray-600 text-lg">
                Criadores que compartilham nossos valores e inspiram viajantes
                todos os dias.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {parceiros.map((p) => {
                const inicial = p.nome.charAt(0).toUpperCase();
                return (
                  <Link
                    key={p.slug}
                    href={`/${p.slug}`}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="h-32 bg-gradient-to-br from-misti-teal to-misti-navy flex items-center justify-center">
                      {p.foto ? (
                        <img
                          src={p.foto}
                          alt={`Foto de ${p.nome}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-heading font-bold text-5xl">
                          {inicial}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading font-bold text-lg text-misti-navy group-hover:text-misti-teal transition-colors">
                        {p.nome}
                      </h3>
                      <p className="text-gray-500 text-sm">{p.handle}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-misti-navy py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="font-heading font-bold text-2xl text-white">
                El Misti Hostels
              </span>
              <p className="text-white/50 text-sm mt-2">
                Mais do que hospedagem &mdash; uma experiencia.
              </p>
            </div>
            <nav className="flex gap-6">
              <a
                href="https://elmistihostels.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Site oficial
              </a>
              <a
                href="https://instagram.com/elmistihostels"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Instagram
              </a>
            </nav>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-white/30 text-xs">
              &copy; {new Date().getFullYear()} El Misti Hostels. Todos os
              direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
