/**
 * Propriedades El Misti no Cloudbeds
 *
 * propertyId: ID numerico da API Cloudbeds (ja temos)
 * bookingCode: Codigo do Booking Engine widget (6 caracteres alfanumericos)
 *   - Formato da URL: https://hotels.cloudbeds.com/reservation/{bookingCode}
 *   - Com promo: https://hotels.cloudbeds.com/reservation/{bookingCode}#promo=CODIGO
 */

export interface Property {
  id: string;
  nome: string;
  cidade: string;
  pais: string;
  propertyId: string;
  bookingCode: string;
  ativo: boolean;
}

export const properties: Record<string, Property> = {
  "misti-ipa": {
    id: "misti-ipa",
    nome: "El Misti Hostel Ipanema",
    cidade: "Rio de Janeiro",
    pais: "Brasil",
    propertyId: "186910",
    bookingCode: "HyLUeR",
    ativo: true,
  },
  "misti-copa": {
    id: "misti-copa",
    nome: "El Misti Suites Copacabana",
    cidade: "Rio de Janeiro",
    pais: "Brasil",
    propertyId: "",
    bookingCode: "0O2dzv",
    ativo: true,
  },
  "misti-centro-ba": {
    id: "misti-centro-ba",
    nome: "El Misti Buenos Aires Centro",
    cidade: "Buenos Aires",
    pais: "Argentina",
    propertyId: "307301",
    bookingCode: "CbK1xz",
    ativo: true,
  },
  "misti-obelisco": {
    id: "misti-obelisco",
    nome: "El Misti Obelisco",
    cidade: "Buenos Aires",
    pais: "Argentina",
    propertyId: "308506",
    bookingCode: "fYIdqW",
    ativo: true,
  },
  "misti-suites-ba": {
    id: "misti-suites-ba",
    nome: "El Misti Suites Argentina",
    cidade: "Buenos Aires",
    pais: "Argentina",
    propertyId: "",
    bookingCode: "sObrS8",
    ativo: true,
  },
};

export const propertyList = Object.values(properties);
export const activeProperties = propertyList.filter((p) => p.ativo);

export function getProperty(id: string): Property | null {
  return properties[id] ?? null;
}

/**
 * Gera URL do Cloudbeds Booking Engine com promo code e datas pre-preenchidas
 */
export function buildBookingUrl(
  bookingCode: string,
  options?: {
    promo?: string;
    checkin?: string;
    checkout?: string;
    adults?: number;
  }
): string {
  if (!bookingCode) return "";

  const base = `https://hotels.cloudbeds.com/reservation/${bookingCode}`;
  const params: string[] = [];

  if (options?.promo) params.push(`promo=${options.promo}`);
  if (options?.checkin) params.push(`checkin=${options.checkin}`);
  if (options?.checkout) params.push(`checkout=${options.checkout}`);
  if (options?.adults) params.push(`adults=${options.adults}`);

  return params.length > 0 ? `${base}#${params.join("&")}` : base;
}
