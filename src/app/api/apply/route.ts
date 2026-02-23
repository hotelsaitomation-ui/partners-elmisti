import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { nome, email, handle, plataforma, motivacao } = body;

    if (!nome?.trim() || !email?.trim() || !handle?.trim() || !plataforma) {
      return NextResponse.json(
        { error: "Campos obrigatorios: nome, email, handle, plataforma" },
        { status: 400 }
      );
    }

    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Email invalido" },
        { status: 400 }
      );
    }

    const submission = {
      nome: nome.trim(),
      email: email.trim(),
      handle: handle.trim(),
      plataforma,
      motivacao: (motivacao ?? "").trim().slice(0, 500),
      timestamp: new Date().toISOString(),
    };

    // Log submission (captured by Vercel function logs)
    console.log("[CANDIDATURA]", JSON.stringify(submission));

    // Try Notion if configured
    const notionToken = process.env.NOTION_TOKEN;
    const candidatosDbId = process.env.NOTION_CANDIDATOS_DB;

    if (notionToken && candidatosDbId) {
      try {
        const { Client } = await import("@notionhq/client");
        const notion = new Client({ auth: notionToken });
        await notion.pages.create({
          parent: { database_id: candidatosDbId },
          properties: {
            Nome: { title: [{ text: { content: submission.nome } }] },
            Email: { email: submission.email },
            Handle: {
              rich_text: [{ text: { content: submission.handle } }],
            },
            Plataforma: { select: { name: submission.plataforma } },
            Motivacao: {
              rich_text: [{ text: { content: submission.motivacao } }],
            },
            Status: { select: { name: "Novo" } },
          },
        });
      } catch (notionError) {
        // Don't fail the request — submission is always logged above
        console.error("[CANDIDATURA] Notion write failed:", notionError);
      }
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/apply]", error);
    return NextResponse.json(
      { error: "Erro ao processar candidatura" },
      { status: 500 }
    );
  }
}
