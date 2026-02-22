/**
 * Notion integration layer (SDK v5)
 *
 * NOTA: Para usar, conecte a integracao a pagina "El Misti Hoteis" no Notion:
 * Pagina -> ... -> Conexoes -> Adicionar integracao
 *
 * Depois, defina NOTION_DATABASE_ID no .env.local
 *
 * Enquanto nao configurado, use lib/partners.ts (JSON local)
 */
import { Client } from "@notionhq/client";
import { Influencer } from "@/types/partner";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const dataSourceId = process.env.NOTION_DATABASE_ID ?? "";

function mapPageToInfluencer(page: any): Influencer {
  const props = page.properties;

  return {
    slug: props.Slug?.rich_text?.[0]?.plain_text ?? "",
    nome: props.Nome?.title?.[0]?.plain_text ?? "",
    handle: props.Handle?.rich_text?.[0]?.plain_text ?? "",
    foto: props.Foto?.url ?? "",
    video: props.Video?.url ?? null,
    nicho: props.Nicho?.select?.name ?? "",
    codigo: props.Codigo?.rich_text?.[0]?.plain_text ?? "",
    desconto: props.Desconto?.number ?? 0,
    validade: props.Validade?.date?.start ?? "",
    tema: props.Tema?.select?.name ?? "misti-original",
    propriedade: props.Propriedade?.select?.name ?? "misti-ipa",
    mensagemPessoal: props.MensagemPessoal?.rich_text?.[0]?.plain_text ?? "",
    mensagemAprovada: props.MensagemAprovada?.checkbox ?? false,
    ativo: props.Ativo?.checkbox ?? false,
  };
}

export async function getPartnersNotion(): Promise<Influencer[]> {
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      property: "Ativo",
      checkbox: { equals: true },
    },
  });

  return response.results.map(mapPageToInfluencer);
}

export async function getPartnerBySlugNotion(slug: string): Promise<Influencer | null> {
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      property: "Slug",
      rich_text: { equals: slug },
    },
  });

  if (response.results.length === 0) return null;
  return mapPageToInfluencer(response.results[0]);
}

export async function createPartnerNotion(
  data: Omit<Influencer, "ativo"> & { ativo?: boolean }
): Promise<void> {
  await notion.pages.create({
    parent: { database_id: dataSourceId },
    properties: {
      Nome: { title: [{ text: { content: data.nome } }] },
      Slug: { rich_text: [{ text: { content: data.slug } }] },
      Handle: { rich_text: [{ text: { content: data.handle } }] },
      Foto: { url: data.foto || null },
      Video: { url: data.video || null },
      Nicho: { select: { name: data.nicho } },
      Codigo: { rich_text: [{ text: { content: data.codigo } }] },
      Desconto: { number: data.desconto },
      Validade: { date: { start: data.validade } },
      Tema: { select: { name: data.tema } },
      Propriedade: { select: { name: data.propriedade } },
      MensagemPessoal: { rich_text: [{ text: { content: data.mensagemPessoal } }] },
      MensagemAprovada: { checkbox: data.mensagemAprovada ?? false },
      Ativo: { checkbox: data.ativo ?? false },
    },
  });
}
