import { NextRequest, NextResponse } from "next/server";
import { getPartnerBySlug, updatePartner } from "@/lib/partners";
import { normalizePartnerInput } from "@/lib/normalize";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { slug } = await params;
    const partner = await getPartnerBySlug(slug);

    if (!partner) {
      return NextResponse.json(
        { error: "Parceiro nao encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(partner, { status: 200 });
  } catch (error) {
    console.error("[GET /api/partners/[slug]]", error);
    return NextResponse.json(
      { error: "Falha ao buscar parceiro" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { slug } = await params;
    const body = await request.json();

    // Normalizar apenas os campos fornecidos no update
    const { data: normalized, warnings } = normalizePartnerInput(body);

    await updatePartner(slug, normalized);

    return NextResponse.json(
      {
        success: true,
        ...(warnings.length > 0 ? { warnings } : {}),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[PUT /api/partners/[slug]]", error);

    const message =
      error instanceof Error ? error.message : "Erro desconhecido";

    if (message.includes("nao encontrado")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Falha ao atualizar parceiro" },
      { status: 500 }
    );
  }
}
