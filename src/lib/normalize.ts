import { Influencer } from "@/types/partner";
import { gerarSlug } from "@/lib/utils";

export interface NormalizeResult {
  data: Partial<Influencer>;
  warnings: string[];
}

// Capitaliza cada palavra da string
function capitalizarPalavras(str: string): string {
  return str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Validacao basica de URL (deve comecar com http)
function isUrlValida(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

// Validacao de data ISO (YYYY-MM-DD ou ISO completo)
function isDataValida(data: string): boolean {
  const d = new Date(data);
  return !isNaN(d.getTime());
}

export function normalizePartnerInput(
  data: Record<string, unknown>
): NormalizeResult {
  const warnings: string[] = [];
  const result: Record<string, unknown> = {};

  // Nome: capitalizar cada palavra
  if (typeof data.nome === "string" && data.nome.trim() !== "") {
    result.nome = capitalizarPalavras(data.nome);
  } else if (data.nome !== undefined) {
    result.nome = data.nome;
  }

  // Handle: garantir @ no inicio, lowercase, sem espacos
  if (typeof data.handle === "string" && data.handle.trim() !== "") {
    const handleLimpo = data.handle.trim().replace(/\s+/g, "").toLowerCase();
    result.handle = handleLimpo.startsWith("@")
      ? handleLimpo
      : `@${handleLimpo}`;
  } else if (data.handle !== undefined) {
    result.handle = data.handle;
  }

  // Slug: auto-gerar do nome se nao fornecido
  if (typeof data.slug === "string" && data.slug.trim() !== "") {
    result.slug = data.slug.trim().toLowerCase().replace(/\s+/g, "-");
  } else if (
    typeof result.nome === "string" ||
    typeof data.nome === "string"
  ) {
    const nomeFonte = (result.nome ?? data.nome) as string;
    result.slug = gerarSlug(nomeFonte);
    warnings.push(
      `Slug auto-gerado do nome: "${result.slug}". Verifique se e o desejado.`
    );
  } else if (data.slug !== undefined) {
    result.slug = data.slug;
  }

  // Codigo: uppercase, sem espacos
  if (typeof data.codigo === "string" && data.codigo.trim() !== "") {
    result.codigo = data.codigo.trim().replace(/\s+/g, "").toUpperCase();
  } else if (data.codigo !== undefined) {
    result.codigo = data.codigo;
  }

  // Foto URL: trim + validar formato
  if (typeof data.foto === "string") {
    const fotoLimpa = data.foto.trim();
    if (fotoLimpa !== "" && !isUrlValida(fotoLimpa)) {
      warnings.push(
        `URL da foto "${fotoLimpa}" nao parece valida (deve comecar com http).`
      );
    }
    result.foto = fotoLimpa;
  } else if (data.foto !== undefined) {
    result.foto = data.foto;
  }

  // Video URL: trim + validar formato (pode ser null)
  if (typeof data.video === "string") {
    const videoLimpo = data.video.trim();
    if (videoLimpo !== "" && !isUrlValida(videoLimpo)) {
      warnings.push(
        `URL do video "${videoLimpo}" nao parece valida (deve comecar com http).`
      );
    }
    result.video = videoLimpo === "" ? null : videoLimpo;
  } else if (data.video === null || data.video === undefined) {
    result.video = null;
  }

  // Desconto: garantir numero entre 0-100
  if (data.desconto !== undefined) {
    const descontoNum = Number(data.desconto);
    if (isNaN(descontoNum)) {
      warnings.push(
        `Desconto "${data.desconto}" nao e um numero valido. Sera definido como 0.`
      );
      result.desconto = 0;
    } else if (descontoNum < 0) {
      warnings.push(`Desconto ${descontoNum} e negativo. Ajustado para 0.`);
      result.desconto = 0;
    } else if (descontoNum > 100) {
      warnings.push(
        `Desconto ${descontoNum} e maior que 100. Ajustado para 100.`
      );
      result.desconto = 100;
    } else {
      result.desconto = descontoNum;
    }
  }

  // Validade: validar formato ISO e garantir data futura
  if (typeof data.validade === "string" && data.validade.trim() !== "") {
    const validadeLimpa = data.validade.trim();
    if (!isDataValida(validadeLimpa)) {
      warnings.push(
        `Validade "${validadeLimpa}" nao e uma data valida (use formato ISO: YYYY-MM-DD).`
      );
      result.validade = validadeLimpa;
    } else {
      const dataValidade = new Date(validadeLimpa);
      const agora = new Date();
      agora.setHours(0, 0, 0, 0);
      if (dataValidade < agora) {
        warnings.push(
          `Validade "${validadeLimpa}" e uma data no passado. O codigo pode estar expirado.`
        );
      }
      result.validade = validadeLimpa;
    }
  } else if (data.validade !== undefined) {
    result.validade = data.validade;
  }

  // Nicho: trim apenas (sem transformacao de case — e definido pelo admin)
  if (typeof data.nicho === "string") {
    result.nicho = data.nicho.trim();
  } else if (data.nicho !== undefined) {
    result.nicho = data.nicho;
  }

  // Tema: passthrough
  if (typeof data.tema === "string" && data.tema.trim() !== "") {
    result.tema = data.tema.trim();
  }

  // Propriedade: passthrough
  if (typeof data.propriedade === "string" && data.propriedade.trim() !== "") {
    result.propriedade = data.propriedade.trim();
  }

  // Mensagem pessoal: trim, limitar a 200 chars
  if (typeof data.mensagemPessoal === "string") {
    result.mensagemPessoal = data.mensagemPessoal.trim().slice(0, 200);
  }

  // Mensagem aprovada: boolean
  if (typeof data.mensagemAprovada === "boolean") {
    result.mensagemAprovada = data.mensagemAprovada;
  }

  // Ativo: passthrough
  if (data.ativo !== undefined) {
    result.ativo = data.ativo;
  }

  return {
    data: result as Partial<Influencer>,
    warnings,
  };
}
