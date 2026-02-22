import { NextRequest, NextResponse } from "next/server";
import { getPartners, getAllPartners, createPartner } from "@/lib/partners";
import { normalizePartnerInput } from "@/lib/normalize";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    const partners = all ? await getAllPartners() : await getPartners();
    return NextResponse.json(partners, { status: 200 });
  } catch (error) {
    console.error("[GET /api/partners]", error);
    return NextResponse.json(
      { error: "Falha ao buscar parceiros" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validar campos obrigatorios ANTES de normalizar
    const required = ["nome", "handle", "nicho", "codigo", "desconto", "validade"];
    for (const field of required) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        return NextResponse.json(
          { error: `Campo obrigatorio ausente: ${field}` },
          { status: 400 }
        );
      }
    }

    // Normalizar input
    const { data: normalized, warnings } = normalizePartnerInput(body);

    await createPartner({
      slug: normalized.slug ?? body.slug,
      nome: normalized.nome ?? body.nome,
      handle: normalized.handle ?? body.handle,
      foto: normalized.foto ?? body.foto ?? "",
      video: normalized.video ?? body.video ?? null,
      nicho: normalized.nicho ?? body.nicho,
      codigo: normalized.codigo ?? body.codigo,
      desconto: normalized.desconto ?? Number(body.desconto),
      validade: normalized.validade ?? body.validade,
      tema: body.tema ?? "misti-original",
      propriedade: body.propriedade ?? "misti-ipa",
      mensagemPessoal: body.mensagemPessoal ?? "",
      mensagemAprovada: false,
      ativo: body.ativo ?? false,
    });

    return NextResponse.json(
      {
        success: true,
        ...(warnings.length > 0 ? { warnings } : {}),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[POST /api/partners]", error);

    const message =
      error instanceof Error ? error.message : "Erro desconhecido";

    if (message.includes("ja existe")) {
      return NextResponse.json({ error: message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Falha ao criar parceiro" },
      { status: 500 }
    );
  }
}
