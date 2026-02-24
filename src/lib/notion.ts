/**
 * Notion integration layer (SDK v5)
 *
 * Env vars necessarias:
 *   NOTION_TOKEN          — Token da integracao Notion
 *   NOTION_DATASOURCE_ID  — ID do data source (collection) para queries
 *   NOTION_DATABASE_ID    — ID do database para criar paginas
 *
 * Na SDK v5, dataSources.query() usa data_source_id (collection),
 * enquanto pages.create() usa database_id. Sao IDs DIFERENTES.
 */
import { Client } from "@notionhq/client";
import { Influencer } from "@/types/partner";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
// SDK v5: query usa data_source_id, create usa database_id
// IDs com defaults hardcoded (nao sao sensíveis — o token e que e)
const dataSourceId = process.env.NOTION_DATASOURCE_ID ?? "feca663af0e0435a8fa5b1e6060e8f10";
const databaseId = process.env.NOTION_DATABASE_ID ?? "27e419e9889a4adaa12e96742f972540";

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
    mensagemPessoal:
      props.MensagemPessoal?.rich_text?.[0]?.plain_text ?? "",
    mensagemAprovada: props.MensagemAprovada?.checkbox ?? false,
    ativo: props.Ativo?.checkbox ?? false,
  };
}

/** Busca paginada do Notion (suporta >100 resultados) */
async function queryAllPages(params?: { filter?: any; start_cursor?: string }): Promise<any[]> {
  const results: any[] = [];
  let cursor: string | undefined = params?.start_cursor;
  do {
    const queryParams: any = { data_source_id: dataSourceId };
    if (params?.filter) queryParams.filter = params.filter;
    if (cursor) queryParams.start_cursor = cursor;
    const response: any = await notion.dataSources.query(queryParams);
    results.push(...response.results);
    cursor = response.next_cursor ?? undefined;
  } while (cursor);
  return results;
}

export async function getPartnersNotion(): Promise<Influencer[]> {
  const results = await queryAllPages({
    filter: { property: "Ativo", checkbox: { equals: true } },
  });
  return results.map(mapPageToInfluencer);
}

export async function getAllPartnersNotion(): Promise<Influencer[]> {
  const results = await queryAllPages();
  return results.map(mapPageToInfluencer);
}

export async function getPartnerBySlugNotion(
  slug: string
): Promise<Influencer | null> {
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

export async function updatePartnerNotion(
  slug: string,
  updates: Partial<Influencer>
): Promise<void> {
  // Find the page by slug
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      property: "Slug",
      rich_text: { equals: slug },
    },
  });

  if (response.results.length === 0) {
    throw new Error(`Parceiro com slug "${slug}" nao encontrado no Notion`);
  }

  const pageId = response.results[0].id;
  const properties: Record<string, any> = {};

  if (updates.nome !== undefined)
    properties.Nome = { title: [{ text: { content: updates.nome } }] };
  if (updates.handle !== undefined)
    properties.Handle = {
      rich_text: [{ text: { content: updates.handle } }],
    };
  if (updates.foto !== undefined)
    properties.Foto = { url: updates.foto || null };
  if (updates.video !== undefined)
    properties.Video = { url: updates.video || null };
  if (updates.nicho !== undefined)
    properties.Nicho = { select: { name: updates.nicho } };
  if (updates.codigo !== undefined)
    properties.Codigo = {
      rich_text: [{ text: { content: updates.codigo } }],
    };
  if (updates.desconto !== undefined)
    properties.Desconto = { number: updates.desconto };
  if (updates.validade !== undefined)
    properties.Validade = { date: { start: updates.validade } };
  if (updates.tema !== undefined)
    properties.Tema = { select: { name: updates.tema } };
  if (updates.propriedade !== undefined)
    properties.Propriedade = { select: { name: updates.propriedade } };
  if (updates.mensagemPessoal !== undefined)
    properties.MensagemPessoal = {
      rich_text: [{ text: { content: updates.mensagemPessoal } }],
    };
  if (updates.mensagemAprovada !== undefined)
    properties.MensagemAprovada = { checkbox: updates.mensagemAprovada };
  if (updates.ativo !== undefined)
    properties.Ativo = { checkbox: updates.ativo };

  await notion.pages.update({ page_id: pageId, properties });
}

export async function createPartnerNotion(
  data: Omit<Influencer, "ativo"> & { ativo?: boolean }
): Promise<void> {
  await notion.pages.create({
    parent: { database_id: databaseId },
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
      MensagemPessoal: {
        rich_text: [{ text: { content: data.mensagemPessoal } }],
      },
      MensagemAprovada: { checkbox: data.mensagemAprovada ?? false },
      Ativo: { checkbox: data.ativo ?? false },
    },
  });
}
