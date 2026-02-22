export interface Influencer {
  slug: string;
  nome: string;
  handle: string;
  foto: string;
  video: string | null;
  nicho: string;
  codigo: string;
  desconto: number;
  validade: string;
  ativo: boolean;
  tema: string;
  propriedade: string; // ID da propriedade El Misti (ex: "misti-ipa")
  mensagemPessoal: string; // Texto pessoal do parceiro (max 200 chars)
  mensagemAprovada: boolean; // Staff aprova antes de publicar
}

export interface Beneficio {
  icon: string;
  titulo: string;
  desc: string;
}

export interface NichoData {
  titulo: string;
  beneficios: Beneficio[];
}
