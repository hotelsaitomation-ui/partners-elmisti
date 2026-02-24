import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getConteudoGlobal,
  getConteudoPropriedade,
  updateConteudoGlobal,
  updateConteudoPropriedade,
} from "@/lib/conteudo";
import { getPartners } from "@/lib/partners";

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

    // Invalida cache de TODAS as paginas de parceiros (conteudo afeta todas)
    revalidatePath("/");
    try {
      const partners = await getPartners();
      for (const p of partners) {
        revalidatePath(`/${p.slug}`);
      }
    } catch {
      // Se falhar buscar parceiros, pelo menos a home foi invalidada
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[PUT /api/conteudo]", error);
    return NextResponse.json({ error: "Falha ao atualizar conteudo" }, { status: 500 });
  }
}
