/**
 * Utilidades compartilhadas (importavel por server E client components)
 * NENHUMA dependencia de server (fs, crypto, etc.)
 */

/** Gera slug URL-safe a partir de um nome */
export function gerarSlug(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
