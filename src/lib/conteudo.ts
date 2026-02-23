import path from "path";
import fs from "fs/promises";

const JSON_PATH = path.join(process.cwd(), "src/data/conteudo.json");

export interface ConteudoPagina {
  heroTitulo: string;
  heroDescricao: string;
  bookingScore: string;
  googleScore: string;
  tripAdvisorRank: string;
  ctaTitulo: string;
  ctaWhatsappTexto: string;
  whatsapp: string;
}

interface ConteudoStore {
  global: ConteudoPagina;
  porPropriedade: Record<string, Partial<ConteudoPagina>>;
}

const useNotion = !!(
  process.env.NOTION_TOKEN && process.env.NOTION_CONTEUDO_DATASOURCE_ID
);

// --- JSON local (fallback) ---

async function readJson(): Promise<ConteudoStore> {
  const raw = await fs.readFile(JSON_PATH, "utf-8");
  return JSON.parse(raw);
}

// --- Notion helpers ---

function mapPageToConteudo(page: any): { escopo: string; data: ConteudoPagina } {
  const props = page.properties;
  return {
    escopo: props.Escopo?.title?.[0]?.plain_text ?? "",
    data: {
      heroTitulo: props.HeroTitulo?.rich_text?.[0]?.plain_text ?? "",
      heroDescricao: props.HeroDescricao?.rich_text?.[0]?.plain_text ?? "",
      bookingScore: props.BookingScore?.rich_text?.[0]?.plain_text ?? "",
      googleScore: props.GoogleScore?.rich_text?.[0]?.plain_text ?? "",
      tripAdvisorRank: props.TripAdvisorRank?.rich_text?.[0]?.plain_text ?? "",
      ctaTitulo: props.CtaTitulo?.rich_text?.[0]?.plain_text ?? "",
      ctaWhatsappTexto: props.CtaWhatsappTexto?.rich_text?.[0]?.plain_text ?? "",
      whatsapp: props.Whatsapp?.rich_text?.[0]?.plain_text ?? "",
    },
  };
}

async function getNotionClient() {
  const { Client } = await import("@notionhq/client");
  return new Client({ auth: process.env.NOTION_TOKEN });
}

async function readConteudoNotion(): Promise<ConteudoStore> {
  const notion = await getNotionClient();
  const dsId = process.env.NOTION_CONTEUDO_DATASOURCE_ID!;

  const response = await notion.dataSources.query({ data_source_id: dsId });

  const store: ConteudoStore = {
    global: {
      heroTitulo: "",
      heroDescricao: "",
      bookingScore: "",
      googleScore: "",
      tripAdvisorRank: "",
      ctaTitulo: "",
      ctaWhatsappTexto: "",
      whatsapp: "",
    },
    porPropriedade: {},
  };

  for (const page of response.results) {
    const { escopo, data } = mapPageToConteudo(page);
    if (escopo === "global") {
      store.global = data;
    } else if (escopo) {
      store.porPropriedade[escopo] = data;
    }
  }

  return store;
}

async function findNotionPageByEscopo(escopo: string): Promise<string | null> {
  const notion = await getNotionClient();
  const dsId = process.env.NOTION_CONTEUDO_DATASOURCE_ID!;

  const response = await notion.dataSources.query({
    data_source_id: dsId,
    filter: {
      property: "Escopo",
      title: { equals: escopo },
    },
  });

  return response.results.length > 0 ? response.results[0].id : null;
}

function buildNotionProperties(updates: Partial<ConteudoPagina>): Record<string, any> {
  const props: Record<string, any> = {};

  if (updates.heroTitulo !== undefined)
    props.HeroTitulo = { rich_text: [{ text: { content: updates.heroTitulo } }] };
  if (updates.heroDescricao !== undefined)
    props.HeroDescricao = { rich_text: [{ text: { content: updates.heroDescricao } }] };
  if (updates.bookingScore !== undefined)
    props.BookingScore = { rich_text: [{ text: { content: updates.bookingScore } }] };
  if (updates.googleScore !== undefined)
    props.GoogleScore = { rich_text: [{ text: { content: updates.googleScore } }] };
  if (updates.tripAdvisorRank !== undefined)
    props.TripAdvisorRank = { rich_text: [{ text: { content: updates.tripAdvisorRank } }] };
  if (updates.ctaTitulo !== undefined)
    props.CtaTitulo = { rich_text: [{ text: { content: updates.ctaTitulo } }] };
  if (updates.ctaWhatsappTexto !== undefined)
    props.CtaWhatsappTexto = { rich_text: [{ text: { content: updates.ctaWhatsappTexto } }] };
  if (updates.whatsapp !== undefined)
    props.Whatsapp = { rich_text: [{ text: { content: updates.whatsapp } }] };

  return props;
}

async function updateNotionConteudo(escopo: string, updates: Partial<ConteudoPagina>): Promise<void> {
  const pageId = await findNotionPageByEscopo(escopo);

  if (!pageId) {
    // Cria nova entrada se nao existe
    const notion = await getNotionClient();
    const dbId = process.env.NOTION_CONTEUDO_DB ?? "";
    const properties = buildNotionProperties(updates);
    properties.Escopo = { title: [{ text: { content: escopo } }] };
    await notion.pages.create({ parent: { database_id: dbId }, properties });
    return;
  }

  const notion = await getNotionClient();
  const properties = buildNotionProperties(updates);
  await notion.pages.update({ page_id: pageId, properties });
}

// --- Funcoes publicas (Notion com fallback JSON) ---

async function readConteudo(): Promise<ConteudoStore> {
  if (useNotion) {
    try {
      return await readConteudoNotion();
    } catch (err) {
      console.error("[readConteudo] Notion failed, fallback JSON:", err);
    }
  }
  return await readJson();
}

/**
 * Retorna o conteudo para uma propriedade.
 * Prioridade: propriedade especifica > global.
 * Interpola variaveis: {handle}, {desconto}, {codigo}
 */
export async function getConteudo(
  propriedadeId: string,
  vars?: { handle?: string; desconto?: number; codigo?: string }
): Promise<ConteudoPagina> {
  const store = await readConteudo();
  const propOverrides = store.porPropriedade[propriedadeId] ?? {};

  // Merge: propriedade sobrescreve global (apenas campos nao-vazios)
  const merged: ConteudoPagina = { ...store.global };
  for (const [key, value] of Object.entries(propOverrides)) {
    if (value !== undefined && value !== "") {
      (merged as any)[key] = value;
    }
  }

  // Interpolar variaveis
  if (vars) {
    for (const key of Object.keys(merged) as (keyof ConteudoPagina)[]) {
      let val = merged[key];
      if (typeof val === "string") {
        if (vars.handle) val = val.replace(/\{handle\}/g, vars.handle);
        if (vars.desconto !== undefined) val = val.replace(/\{desconto\}/g, String(vars.desconto));
        if (vars.codigo) val = val.replace(/\{codigo\}/g, vars.codigo);
        merged[key] = val;
      }
    }
  }

  return merged;
}

/**
 * Retorna o conteudo global (para admin)
 */
export async function getConteudoGlobal(): Promise<ConteudoPagina> {
  const store = await readConteudo();
  return store.global;
}

/**
 * Retorna o conteudo especifico de uma propriedade (para admin)
 */
export async function getConteudoPropriedade(propriedadeId: string): Promise<Partial<ConteudoPagina>> {
  const store = await readConteudo();
  return store.porPropriedade[propriedadeId] ?? {};
}

/**
 * Atualiza o conteudo global
 */
export async function updateConteudoGlobal(updates: Partial<ConteudoPagina>): Promise<void> {
  if (useNotion) {
    await updateNotionConteudo("global", updates);
    return;
  }
  // Fallback JSON (nao funciona no Vercel)
  const store = await readJson();
  store.global = { ...store.global, ...updates };
  await fs.writeFile(JSON_PATH, JSON.stringify(store, null, 2), "utf-8");
}

/**
 * Atualiza o conteudo de uma propriedade especifica
 */
export async function updateConteudoPropriedade(
  propriedadeId: string,
  updates: Partial<ConteudoPagina>
): Promise<void> {
  if (useNotion) {
    await updateNotionConteudo(propriedadeId, updates);
    return;
  }
  // Fallback JSON (nao funciona no Vercel)
  const store = await readJson();
  store.porPropriedade[propriedadeId] = {
    ...store.porPropriedade[propriedadeId],
    ...updates,
  };
  await fs.writeFile(JSON_PATH, JSON.stringify(store, null, 2), "utf-8");
}
