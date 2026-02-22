import { NextRequest, NextResponse } from "next/server";
import {
  getConteudoGlobal,
  getConteudoPropriedade,
  updateConteudoGlobal,
  updateConteudoPropriedade,
} from "@/lib/conteudo";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const propriedadeId = searchParams.get("propriedade");

    if (propriedadeId) {
      const conteudo = await getConteudoPropriedade(propriedadeId);
      return NextResponse.json({ propriedade: propriedadeId, conteudo }, { status: 200 });
    }

    const global = await getConteudoGlobal();
    return NextResponse.json({ conteudo: global }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/conteudo]", error);
    return NextResponse.json({ error: "Falha ao buscar conteudo" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { propriedade, conteudo } = body;

    if (!conteudo || typeof conteudo !== "object") {
      return NextResponse.json({ error: "Conteudo invalido" }, { status: 400 });
    }

    if (propriedade) {
      await updateConteudoPropriedade(propriedade, conteudo);
    } else {
      await updateConteudoGlobal(conteudo);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[PUT /api/conteudo]", error);
    return NextResponse.json({ error: "Falha ao atualizar conteudo" }, { status: 500 });
  }
}
