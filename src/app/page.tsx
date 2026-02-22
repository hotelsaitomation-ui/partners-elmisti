import Link from "next/link";
import { getPartners } from "@/lib/partners";

export default async function HomePage() {
  const parceiros = await getPartners();

  return (
    <div className="min-h-screen bg-gradient-to-br from-misti-teal-light via-white to-misti-orange-light/30">
      {/* Header */}
      <header className="bg-misti-navy py-6 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-heading font-bold text-xl text-white">El Misti Hostels</span>
          <a
            href="https://elmistihostels.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white text-sm transition-colors"
          >
            Site oficial
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-misti-navy leading-tight mb-4">
            Parceiros El Misti
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Acesse a pagina do seu influenciador favorito e garanta desconto exclusivo na hospedagem.
          </p>
        </div>
      </section>

      {/* Grid de parceiros */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          {parceiros.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">Nenhum parceiro ativo no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {parceiros.map((p) => {
                const inicial = p.nome.charAt(0).toUpperCase();
                return (
                  <Link
                    key={p.slug}
                    href={`/${p.slug}`}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* Avatar */}
                    <div className="h-40 bg-gradient-to-br from-misti-teal to-misti-navy flex items-center justify-center relative">
                      {p.foto ? (
                        <img
                          src={p.foto}
                          alt={`Foto de ${p.nome}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-heading font-bold text-6xl">{inicial}</span>
                      )}
                      {/* Badge desconto */}
                      <div className="absolute top-3 right-3 bg-misti-orange text-white font-heading font-bold text-sm px-3 py-1 rounded-lg shadow">
                        -{p.desconto}% OFF
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h2 className="font-heading font-bold text-lg text-misti-navy group-hover:text-misti-teal transition-colors">
                        {p.nome}
                      </h2>
                      <p className="text-gray-500 text-sm mt-0.5">{p.handle}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="font-mono font-semibold text-misti-teal text-sm bg-misti-teal-light px-3 py-1 rounded-lg">
                          {p.codigo}
                        </span>
                        <span className="text-gray-400 text-xs">codigo exclusivo</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-misti-navy py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-heading font-bold text-white">El Misti Hostels</span>
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
            <a
              href="https://wa.me/5521999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              WhatsApp
            </a>
          </nav>
          <p className="text-white/40 text-xs">&copy; {new Date().getFullYear()} El Misti Hostels</p>
        </div>
      </footer>
    </div>
  );
}
