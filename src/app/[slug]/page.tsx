import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPartners, getPartnerBySlug } from "@/lib/partners";
import { nichos } from "@/data/nichos";
import { getTheme } from "@/data/themes";
import { getProperty } from "@/data/properties";
import { getConteudo } from "@/lib/conteudo";
import SmartFormElMisti, { SmartFormTrigger } from "@/components/SmartFormElMisti";
import CodigoCopiavel from "@/components/CodigoCopiavel";

// ISR: regenera paginas a cada 60s + on-demand via revalidatePath nos API routes
export const revalidate = 60;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const partners = await getPartners();
  return partners.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const influencer = await getPartnerBySlug(slug);

  if (!influencer) {
    return { title: "Parceiro nao encontrado | El Misti" };
  }

  const property = getProperty(influencer.propriedade ?? "misti-ipa");

  return {
    title: `${influencer.desconto}% OFF no ${property?.nome ?? "El Misti"} | Codigo ${influencer.codigo}`,
    description: `Use o codigo ${influencer.codigo} e garanta ${influencer.desconto}% de desconto no ${property?.nome ?? "El Misti Hostels"}. Oferta exclusiva de ${influencer.handle}.`,
  };
}

const iconesSVG: Record<string, React.ReactNode> = {
  shield: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  users: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  globe: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  dollar: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  star: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  map: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  board: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  ),
  wave: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  wifi: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  ),
  laptop: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  coffee: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
    </svg>
  ),
  bed: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  heart: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
};

/** Calcula dias restantes da oferta */
function diasRestantes(validade: string): number {
  const fim = new Date(validade + "T23:59:59");
  const hoje = new Date();
  return Math.max(0, Math.ceil((fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)));
}

export default async function PartnerPage({ params }: Props) {
  const { slug } = await params;
  const influencer = await getPartnerBySlug(slug);

  if (!influencer || !influencer.ativo) {
    notFound();
  }

  const nichoDados = nichos[influencer.nicho];
  const theme = getTheme(influencer.tema ?? "misti-original");
  const property = getProperty(influencer.propriedade ?? "misti-ipa");
  const inicial = influencer.nome.charAt(0).toUpperCase();

  // Conteudo dinamico (global + override por propriedade)
  const conteudo = await getConteudo(influencer.propriedade ?? "misti-ipa", {
    handle: influencer.handle,
    desconto: influencer.desconto,
    codigo: influencer.codigo,
  });

  const validadeFormatada = new Date(influencer.validade + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const dias = diasRestantes(influencer.validade);

  const whatsappTexto = encodeURIComponent(
    `Ola! Vim pelo ${influencer.handle} e quero usar o codigo ${influencer.codigo} para reservar no ${property?.nome ?? "El Misti"}.`
  );

  // Mensagem pessoal (so aparece se aprovada pelo staff)
  const temMensagem = influencer.mensagemPessoal && influencer.mensagemAprovada;

  return (
    <>
      <SmartFormElMisti
        codigo={influencer.codigo}
        desconto={influencer.desconto}
        influencerSlug={influencer.slug}
        bookingCode={property?.bookingCode ?? ""}
        propertyNome={property?.nome ?? "El Misti Hostels"}
        themeColor={theme.primary}
        themeDark={theme.primaryDark}
      />

      <main>
        {/* 1. HERO */}
        <section
          className="py-12 px-4"
          style={{ background: `linear-gradient(135deg, ${theme.accentLight}, white, ${theme.primaryLight}40)` }}
        >
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Foto */}
            <div className="relative">
              {influencer.foto ? (
                <img
                  src={influencer.foto}
                  alt={`Foto de ${influencer.nome}`}
                  className="w-full aspect-[4/5] object-cover rounded-2xl shadow-2xl"
                  fetchPriority="high"
                />
              ) : (
                <div
                  className="w-full aspect-[4/5] rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-3"
                  style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.dark})` }}
                >
                  <span className="text-white text-8xl font-heading font-bold">{inicial}</span>
                  <span className="text-white/70 text-lg">{influencer.handle}</span>
                </div>
              )}
              <div
                className="absolute top-4 right-4 text-white font-heading font-bold text-lg px-4 py-2 rounded-xl shadow-lg"
                style={{ backgroundColor: theme.primary }}
              >
                -{influencer.desconto}% OFF
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="font-semibold text-lg" style={{ color: theme.accent }}>
                  {influencer.handle}
                </p>
                <h1
                  className="font-heading font-bold text-3xl md:text-4xl mt-1 leading-tight"
                  style={{ color: theme.dark }}
                >
                  {conteudo.heroTitulo}
                </h1>
                <p className="text-gray-600 mt-3 leading-relaxed">
                  {conteudo.heroDescricao}
                </p>
              </div>

              {/* Mensagem pessoal do parceiro */}
              {temMensagem && (
                <div
                  className="rounded-xl px-5 py-4 border-l-4"
                  style={{ borderColor: theme.primary, backgroundColor: `${theme.primaryLight}30` }}
                >
                  <p className="text-gray-700 text-sm italic leading-relaxed">
                    &ldquo;{influencer.mensagemPessoal}&rdquo;
                  </p>
                  <p className="text-gray-500 text-xs mt-2 font-medium">
                    — {influencer.nome}, {influencer.handle}
                  </p>
                </div>
              )}

              {/* Contador de urgencia */}
              {dias > 0 && dias <= 30 && (
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className="inline-flex items-center gap-1.5 font-semibold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: theme.primary }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {dias === 1 ? "Ultimo dia!" : `${dias} dias restantes`}
                  </span>
                </div>
              )}

              <SmartFormTrigger
                label={`Reservar com ${influencer.desconto}% OFF`}
                themeColor={theme.primary}
                themeDark={theme.primaryDark}
              />

              <CodigoCopiavel codigo={influencer.codigo} themeColor={theme.primary} />

              {/* Badges de avaliacao (condicional - so aparece se preenchido) */}
              {(conteudo.bookingScore || conteudo.googleScore || conteudo.tripAdvisorRank) && (
                <div className="flex flex-wrap gap-3">
                  {conteudo.bookingScore && (
                    <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
                      <span className="text-yellow-500 font-bold text-sm">Booking</span>
                      <span className="text-gray-800 font-semibold text-sm">{conteudo.bookingScore}</span>
                    </div>
                  )}
                  {conteudo.googleScore && (
                    <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
                      <span className="text-blue-600 font-bold text-sm">Google</span>
                      <span className="text-gray-800 font-semibold text-sm">{conteudo.googleScore}</span>
                    </div>
                  )}
                  {conteudo.tripAdvisorRank && (
                    <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
                      <span className="text-green-600 font-bold text-sm">TripAdvisor</span>
                      <span className="text-gray-800 font-semibold text-sm">{conteudo.tripAdvisorRank}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 2. CONEXAO - Beneficios do nicho */}
        {nichoDados && (
          <section className="py-14 px-4" style={{ backgroundColor: theme.warm }}>
            <div className="max-w-5xl mx-auto">
              <h2
                className="font-heading font-bold text-2xl md:text-3xl text-center mb-10"
                style={{ color: theme.dark }}
              >
                {nichoDados.titulo}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {nichoDados.beneficios.map((b) => (
                  <div
                    key={b.titulo}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow duration-300"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white"
                      style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` }}
                    >
                      {iconesSVG[b.icon] ?? (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <h3 className="font-heading font-semibold text-lg mb-1" style={{ color: theme.dark }}>
                      {b.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 3. VIDEO - Condicional */}
        {influencer.video && (
          <section className="py-14 px-4 bg-white">
            <div className="max-w-3xl mx-auto">
              <h2
                className="font-heading font-bold text-2xl md:text-3xl text-center mb-8"
                style={{ color: theme.dark }}
              >
                Veja como e ficar no El Misti
              </h2>
              <div className="aspect-video rounded-2xl shadow-2xl overflow-hidden">
                <iframe
                  src={influencer.video}
                  title={`Video do El Misti - ${influencer.handle}`}
                  className="w-full h-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </section>
        )}

        {/* 4. CTA FINAL */}
        <section className="py-16 px-4" style={{ backgroundColor: theme.primary }}>
          <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-white leading-tight">
              {conteudo.ctaTitulo}
            </h2>

            <div className="bg-white/20 backdrop-blur rounded-2xl px-8 py-4">
              <p className="text-white/80 text-sm mb-1">Seu codigo exclusivo</p>
              <span className="font-heading font-bold text-4xl text-white tracking-widest">
                {influencer.codigo}
              </span>
            </div>

            <SmartFormTrigger
              label={`Reservar com ${influencer.desconto}% OFF`}
              themeColor={theme.primary}
              themeDark={theme.primaryDark}
              className="bg-white font-heading font-semibold py-4 px-10 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              style={{ color: theme.primary }}
            />

            <a
              href={`https://wa.me/${conteudo.whatsapp}?text=${whatsappTexto}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/90 hover:text-white underline underline-offset-4 text-sm transition-colors"
            >
              {conteudo.ctaWhatsappTexto}
            </a>

            <p className="text-white/70 text-sm">
              Oferta valida ate {validadeFormatada}
            </p>
          </div>
        </section>

        {/* 5. FOOTER */}
        <footer className="py-10 px-4" style={{ backgroundColor: theme.dark }}>
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="font-heading font-bold text-xl text-white">{property?.nome ?? "El Misti Hostels"}</span>
              <p className="text-white/50 text-sm mt-1">{property?.cidade ?? ""}</p>
            </div>

            <nav className="flex gap-6" aria-label="Links do rodape">
              <a href="https://elmistihostels.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white text-sm transition-colors">
                Site oficial
              </a>
              <a href="https://instagram.com/elmistihostels" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white text-sm transition-colors">
                Instagram
              </a>
              <a href={`https://wa.me/${conteudo.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white text-sm transition-colors">
                WhatsApp
              </a>
            </nav>

            <p className="text-white/40 text-xs">
              &copy; {new Date().getFullYear()} El Misti Hostels
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
