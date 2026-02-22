import { NextRequest, NextResponse } from "next/server";

interface PolishCopyRequest {
  nome: string;
  handle: string;
  nicho: string;
  desconto: number;
}

interface PolishCopyResponse {
  titulo: string;
  descricao: string;
  cta: string;
}

interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface AIChoice {
  message: {
    content: string;
  };
}

interface AIApiResponse {
  choices: AIChoice[];
}

function buildPrompt(data: PolishCopyRequest): string {
  return `Gere copy de marketing para landing page de hostel. Tom: jovem, acolhedor, energetico.
- Parceiro: ${data.nome} (${data.handle}), nicho: ${data.nicho}
- Oferta: ${data.desconto}% de desconto no El Misti Hostels, Ipanema, Rio de Janeiro

Retorne APENAS um JSON valido, sem markdown, sem explicacoes, no formato:
{"titulo": "...", "descricao": "...", "cta": "..."}

Restricoes:
- titulo: maximo 60 caracteres
- descricao: maximo 200 caracteres
- cta: maximo 30 caracteres`;
}

async function callDeepSeek(
  messages: AIMessage[],
  apiKey: string
): Promise<AIApiResponse> {
  const response = await fetch(
    "https://api.deepseek.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
        temperature: 0.7,
        max_tokens: 300,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `DeepSeek API retornou status ${response.status}: ${errorText}`
    );
  }

  return response.json();
}

async function callGroq(
  messages: AIMessage[],
  apiKey: string
): Promise<AIApiResponse> {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages,
        temperature: 0.7,
        max_tokens: 300,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Groq API retornou status ${response.status}: ${errorText}`
    );
  }

  return response.json();
}

function parseAIResponse(content: string): PolishCopyResponse {
  // Remover markdown code blocks se presentes
  const cleaned = content
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  if (
    typeof parsed.titulo !== "string" ||
    typeof parsed.descricao !== "string" ||
    typeof parsed.cta !== "string"
  ) {
    throw new Error(
      "Resposta da IA nao contem os campos esperados (titulo, descricao, cta)"
    );
  }

  return {
    titulo: parsed.titulo.slice(0, 60),
    descricao: parsed.descricao.slice(0, 200),
    cta: parsed.cta.slice(0, 30),
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validar campos obrigatorios
    const required: (keyof PolishCopyRequest)[] = [
      "nome",
      "handle",
      "nicho",
      "desconto",
    ];
    for (const field of required) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        return NextResponse.json(
          { error: `Campo obrigatorio ausente: ${field}` },
          { status: 400 }
        );
      }
    }

    const input: PolishCopyRequest = {
      nome: String(body.nome).trim(),
      handle: String(body.handle).trim(),
      nicho: String(body.nicho).trim(),
      desconto: Number(body.desconto),
    };

    if (isNaN(input.desconto) || input.desconto < 0 || input.desconto > 100) {
      return NextResponse.json(
        { error: "Campo desconto deve ser um numero entre 0 e 100" },
        { status: 400 }
      );
    }

    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    if (!deepseekKey && !groqKey) {
      return NextResponse.json(
        {
          error:
            "Nenhuma chave de API configurada. Configure DEEPSEEK_API_KEY ou GROQ_API_KEY no .env.local",
        },
        { status: 503 }
      );
    }

    const messages: AIMessage[] = [
      {
        role: "user",
        content: buildPrompt(input),
      },
    ];

    let aiResponse: AIApiResponse;
    let providerUsado: string;

    // Tentar DeepSeek primeiro, fallback para Groq
    if (deepseekKey) {
      try {
        aiResponse = await callDeepSeek(messages, deepseekKey);
        providerUsado = "deepseek";
      } catch (deepseekError) {
        console.error("[polish-copy] DeepSeek falhou, tentando Groq:", deepseekError);

        if (!groqKey) {
          throw deepseekError;
        }

        aiResponse = await callGroq(messages, groqKey);
        providerUsado = "groq-fallback";
      }
    } else {
      aiResponse = await callGroq(messages, groqKey!);
      providerUsado = "groq";
    }

    const rawContent = aiResponse.choices?.[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json(
        { error: "API de IA retornou resposta vazia" },
        { status: 502 }
      );
    }

    const copy = parseAIResponse(rawContent);

    return NextResponse.json(
      {
        ...copy,
        _provider: providerUsado,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[POST /api/ai/polish-copy]", error);

    const message =
      error instanceof Error ? error.message : "Erro desconhecido";

    if (message.includes("JSON")) {
      return NextResponse.json(
        {
          error: "IA retornou resposta em formato inesperado",
          detalhe: message,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "Falha ao gerar copy com IA", detalhe: message },
      { status: 500 }
    );
  }
}
