import { Influencer } from "@/types/partner";
import path from "path";
import fs from "fs/promises";

// Caminho do JSON local (fallback quando Notion nao esta configurado)
const JSON_PATH = path.join(process.cwd(), "src/data/influencers.json");

// --- JSON local (funciona sem configuracao externa) ---

async function readJson(): Promise<{ influencers: Influencer[] }> {
  const raw = await fs.readFile(JSON_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeJson(data: { influencers: Influencer[] }): Promise<void> {
  await fs.writeFile(JSON_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// --- CRUD Functions ---

export async function getPartners(): Promise<Influencer[]> {
  const data = await readJson();
  return data.influencers.filter((inf) => inf.ativo);
}

export async function getAllPartners(): Promise<Influencer[]> {
  const data = await readJson();
  return data.influencers;
}

export async function getPartnerBySlug(slug: string): Promise<Influencer | null> {
  const data = await readJson();
  return data.influencers.find((inf) => inf.slug === slug) ?? null;
}

export async function createPartner(
  partner: Omit<Influencer, "ativo"> & { ativo?: boolean }
): Promise<void> {
  const data = await readJson();

  const exists = data.influencers.some((inf) => inf.slug === partner.slug);
  if (exists) {
    throw new Error(`Parceiro com slug "${partner.slug}" ja existe`);
  }

  data.influencers.push({
    ...partner,
    ativo: partner.ativo ?? false,
  });

  await writeJson(data);
}

export async function updatePartner(
  slug: string,
  updates: Partial<Influencer>
): Promise<void> {
  const data = await readJson();

  const index = data.influencers.findIndex((inf) => inf.slug === slug);
  if (index === -1) {
    throw new Error(`Parceiro com slug "${slug}" nao encontrado`);
  }

  data.influencers[index] = { ...data.influencers[index], ...updates };
  await writeJson(data);
}

export async function deletePartner(slug: string): Promise<void> {
  const data = await readJson();

  const index = data.influencers.findIndex((inf) => inf.slug === slug);
  if (index === -1) {
    throw new Error(`Parceiro com slug "${slug}" nao encontrado`);
  }

  data.influencers.splice(index, 1);
  await writeJson(data);
}
