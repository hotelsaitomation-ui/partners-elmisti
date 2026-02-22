"use client";

import { useState, useEffect } from "react";
import { buildBookingUrl } from "@/data/properties";

interface SmartFormProps {
  codigo: string;
  desconto: number;
  influencerSlug: string;
  bookingCode: string;
  propertyNome: string;
  themeColor?: string;
  themeDark?: string;
}

export default function SmartFormElMisti({
  codigo,
  desconto,
  influencerSlug,
  bookingCode,
  propertyNome,
  themeColor = "#FD8000",
  themeDark = "#DB6F00",
}: SmartFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [etapa, setEtapa] = useState<"datas" | "confirmado">("datas");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(1);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("openSmartForm", handler);
    return () => window.removeEventListener("openSmartForm", handler);
  }, []);

  function handleCheckinChange(value: string) {
    setCheckin(value);
    if (checkout && checkout < value) setCheckout("");
  }

  function getBookingUrl(): string {
    return buildBookingUrl(bookingCode, {
      promo: codigo,
      checkin,
      checkout,
      adults,
    });
  }

  function getWhatsAppUrl(): string {
    const texto = encodeURIComponent(
      `Ola! Quero reservar no ${propertyNome}.\n` +
      `Codigo: ${codigo} (${desconto}% OFF)\n` +
      `Check-in: ${checkin}\n` +
      `Check-out: ${checkout}\n` +
      `Hospedes: ${adults}\n` +
      `Parceiro: ${influencerSlug}`
    );
    return `https://wa.me/5521999999999?text=${texto}`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (bookingCode) {
      // Abre Cloudbeds em nova aba com cupom pre-aplicado
      window.open(getBookingUrl(), "_blank");
    } else {
      // Fallback WhatsApp
      window.open(getWhatsAppUrl(), "_blank");
    }
    setEtapa("confirmado");
  }

  function handleClose() {
    setIsOpen(false);
    setEtapa("datas");
  }

  if (!isOpen) return null;

  const hoje = new Date().toISOString().split("T")[0];

  // Formatar datas pra exibicao
  const checkinFmt = checkin
    ? new Date(checkin + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    : "";
  const checkoutFmt = checkout
    ? new Date(checkout + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg">
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between"
          style={{ background: `linear-gradient(to right, ${themeColor}, ${themeDark})` }}
        >
          <div>
            <h2 className="font-heading text-xl font-bold text-white">
              {etapa === "datas" ? "Reserve com desconto" : "Reserva iniciada!"}
            </h2>
            <p className="text-white/80 text-sm mt-0.5">
              {desconto}% OFF com o codigo {codigo}
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Fechar formulario"
            className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conteudo */}
        <div className="px-6 py-6">
          {etapa === "datas" ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Propriedade */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2.5">
                <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-gray-700 font-medium">{propertyNome}</span>
              </div>

              {/* Datas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="sf-checkin" className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="sf-checkin"
                    type="date"
                    required
                    value={checkin}
                    min={hoje}
                    onChange={(e) => handleCheckinChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="sf-checkout" className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="sf-checkout"
                    type="date"
                    required
                    value={checkout}
                    min={checkin || hoje}
                    onChange={(e) => setCheckout(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Hospedes */}
              <div>
                <label htmlFor="sf-adults" className="block text-sm font-medium text-gray-700 mb-1">
                  Hospedes
                </label>
                <select
                  id="sf-adults"
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "hospede" : "hospedes"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Codigo (readonly) */}
              <div>
                <label htmlFor="sf-codigo" className="block text-sm font-medium text-gray-700 mb-1">
                  Codigo de desconto
                </label>
                <input
                  id="sf-codigo"
                  type="text"
                  readOnly
                  value={codigo}
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm font-mono font-semibold cursor-default"
                  style={{ color: themeColor }}
                />
              </div>

              <button
                type="submit"
                className="w-full text-white font-heading font-bold py-3.5 rounded-xl transition-colors mt-1 flex items-center justify-center gap-2"
                style={{ backgroundColor: themeColor }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = themeDark)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = themeColor)}
              >
                Reservar com {desconto}% OFF
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>

              <p className="text-gray-400 text-xs text-center">
                O sistema de reservas do El Misti abrira com seu desconto aplicado
              </p>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-5 py-4">
              {/* Icone de sucesso */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${themeColor}15` }}
              >
                <svg className="w-8 h-8" fill="none" stroke={themeColor} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="text-center">
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-1">
                  Reserva aberta em nova aba!
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  O sistema do El Misti abriu com seu codigo <strong style={{ color: themeColor }}>{codigo}</strong> ja aplicado.
                  {checkinFmt && checkoutFmt && (
                    <> Datas: {checkinFmt} a {checkoutFmt}.</>
                  )}
                </p>
              </div>

              {/* Resumo */}
              <div className="w-full bg-gray-50 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Propriedade</span>
                  <span className="text-gray-800 font-medium">{propertyNome}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Desconto</span>
                  <span className="font-semibold" style={{ color: themeColor }}>{desconto}% OFF</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Codigo</span>
                  <span className="font-mono font-semibold" style={{ color: themeColor }}>{codigo}</span>
                </div>
              </div>

              {/* Acoes */}
              <div className="w-full flex flex-col gap-3">
                <a
                  href={bookingCode ? getBookingUrl() : getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-white font-heading font-bold py-3 rounded-xl transition-colors text-center flex items-center justify-center gap-2"
                  style={{ backgroundColor: themeColor }}
                >
                  Abrir novamente
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-xl transition-colors text-sm"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface TriggerProps {
  label: string;
  themeColor?: string;
  themeDark?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function SmartFormTrigger({
  label,
  themeColor = "#FD8000",
  themeDark = "#DB6F00",
  className,
  style,
}: TriggerProps) {
  function handleClick() {
    window.dispatchEvent(new CustomEvent("openSmartForm"));
  }

  return (
    <button
      onClick={handleClick}
      className={className ?? "inline-flex items-center justify-center text-white font-heading font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"}
      style={style ?? { backgroundColor: themeColor }}
      onMouseEnter={(e) => { if (!style) e.currentTarget.style.backgroundColor = themeDark; }}
      onMouseLeave={(e) => { if (!style) e.currentTarget.style.backgroundColor = themeColor; }}
    >
      {label}
    </button>
  );
}
