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

async function readConteudo(): Promise<ConteudoStore> {
  const raw = await fs.readFile(JSON_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeConteudo(data: ConteudoStore): Promise<void> {
  await fs.writeFile(JSON_PATH, JSON.stringify(data, null, 2), "utf-8");
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
  const store = await readConteudo();
  store.global = { ...store.global, ...updates };
  await writeConteudo(store);
}

/**
 * Atualiza o conteudo de uma propriedade especifica
 */
export async function updateConteudoPropriedade(
  propriedadeId: string,
  updates: Partial<ConteudoPagina>
): Promise<void> {
  const store = await readConteudo();
  store.porPropriedade[propriedadeId] = {
    ...store.porPropriedade[propriedadeId],
    ...updates,
  };
  await writeConteudo(store);
}
