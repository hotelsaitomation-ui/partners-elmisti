import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const checks: Record<string, string> = {};

  // 1. Checar env vars (sem mostrar valores)
  checks.NOTION_TOKEN = process.env.NOTION_TOKEN ? `set (${process.env.NOTION_TOKEN.substring(0, 8)}...)` : "NOT SET";
  checks.NOTION_DATASOURCE_ID = process.env.NOTION_DATASOURCE_ID ?? "(using hardcoded fallback)";
  checks.NOTION_CONTEUDO_DATASOURCE_ID = process.env.NOTION_CONTEUDO_DATASOURCE_ID ?? "(using hardcoded fallback)";

  // 2. Testar conexao Notion - partners
  try {
    const { Client } = await import("@notionhq/client");
    const c = new Client({ auth: process.env.NOTION_TOKEN });
    const dsId = process.env.NOTION_DATASOURCE_ID ?? "feca663af0e0435a8fa5b1e6060e8f10";
    const r = await c.dataSources.query({ data_source_id: dsId });
    checks.notion_partners = `OK - ${r.results.length} resultados`;
  } catch (e: any) {
    checks.notion_partners = `ERRO: ${e.code ?? "unknown"} - ${e.message?.substring(0, 100)}`;
  }

  // 3. Testar conexao Notion - conteudo
  try {
    const { Client } = await import("@notionhq/client");
    const c = new Client({ auth: process.env.NOTION_TOKEN });
    const dsId = process.env.NOTION_CONTEUDO_DATASOURCE_ID ?? "04bab809518944118beb8a28ddbc0d2a";
    const r = await c.dataSources.query({ data_source_id: dsId });
    checks.notion_conteudo = `OK - ${r.results.length} resultados`;
  } catch (e: any) {
    checks.notion_conteudo = `ERRO: ${e.code ?? "unknown"} - ${e.message?.substring(0, 100)}`;
  }

  return NextResponse.json(checks);
}
