"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Influencer } from "@/types/partner";
import ThemeSelector from "@/components/ThemeSelector";
import { getNichoLabel } from "@/data/nichos";

interface FormEditavel {
  nome: string;
  handle: string;
  foto: string;
  video: string;
  tema: string;
  mensagemPessoal: string;
}

export default function SetupPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";

  const [parceiro, setParceiro] = useState<Influencer | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [form, setForm] = useState<FormEditavel>({ nome: "", handle: "", foto: "", video: "", tema: "misti-original", mensagemPessoal: "" });
  const [salvando, setSalvando] = useState(false);
  const [feedback, setFeedback] = useState<{ tipo: "sucesso" | "erro"; mensagem: string } | null>(null);

  const buscarParceiro = useCallback(async () => {
    if (!slug) return;
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch(`/api/partners/${slug}`);
      if (res.status === 404) {
        setErro("Parceiro nao encontrado.");
        return;
      }
      if (!res.ok) throw new Error("Falha ao buscar dados");
      const dados: Influencer = await res.json();
      setParceiro(dados);
      setForm({
        nome: dados.nome,
        handle: dados.handle,
        foto: dados.foto ?? "",
        video: dados.video ?? "",
        tema: dados.tema ?? "misti-original",
        mensagemPessoal: dados.mensagemPessoal ?? "",
      });
    } catch {
      setErro("Nao foi possivel carregar os dados do parceiro.");
    } finally {
      setCarregando(false);
    }
  }, [slug]);

  useEffect(() => {
    buscarParceiro();
  }, [buscarParceiro]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/partners/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          handle: form.handle,
          foto: form.foto || "",
          video: form.video || null,
          tema: form.tema,
          mensagemPessoal: form.mensagemPessoal,
        }),
      });

      if (!res.ok) {
        const dados = await res.json();
        throw new Error(dados.error || "Falha ao salvar");
      }

      setFeedback({ tipo: "sucesso", mensagem: "Dados atualizados com sucesso!" });
      await buscarParceiro();
    } catch (err: any) {
      setFeedback({ tipo: "erro", mensagem: err.message });
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-misti-gray-warm flex items-center justify-center">
        <p className="text-gray-400">Carregando...</p>
      </div>
    );
  }

  if (erro || !parceiro) {
    return (
      <div className="min-h-screen bg-misti-gray-warm flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{erro ?? "Parceiro nao encontrado."}</p>
        <Link href="/admin" className="text-misti-teal hover:underline text-sm">
          Voltar para admin
        </Link>
      </div>
    );
  }

  const validadeFormatada = new Date(parceiro.validade + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-misti-gray-warm">
      {/* Header */}
      <header className="bg-misti-navy px-4 py-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <span className="font-heading font-bold text-xl text-white">El Misti</span>
            <span className="text-white/50 ml-2 text-sm">Setup</span>
          </div>
          <Link href="/admin" className="text-white/60 hover:text-white text-sm transition-colors">
            Voltar para admin
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-heading font-bold text-2xl text-misti-navy">{parceiro.nome}</h1>
            <p className="text-gray-500 mt-1">{parceiro.handle}</p>
          </div>
          <Link
            href={`/${parceiro.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 text-misti-teal hover:text-misti-navy text-sm font-medium transition-colors border border-misti-teal/30 hover:border-misti-navy px-4 py-2 rounded-xl"
          >
            Ver pagina do parceiro
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium ${
              feedback.tipo === "sucesso"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {feedback.mensagem}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Formulario editavel */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-heading font-semibold text-lg text-misti-navy mb-6">
              Informacoes editaveis
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="setup-nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  id="setup-nome"
                  type="text"
                  required
                  value={form.nome}
                  onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-misti-orange"
                />
              </div>

              <div>
                <label htmlFor="setup-handle" className="block text-sm font-medium text-gray-700 mb-1">
                  Handle <span className="text-red-500">*</span>
                </label>
                <input
                  id="setup-handle"
                  type="text"
                  required
                  placeholder="@handle"
                  value={form.handle}
                  onChange={(e) => setForm((p) => ({ ...p, handle: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-misti-orange"
                />
              </div>

              <div>
                <label htmlFor="setup-foto" className="block text-sm font-medium text-gray-700 mb-1">
                  URL da foto
                </label>
                <input
                  id="setup-foto"
                  type="url"
                  placeholder="https://..."
                  value={form.foto}
                  onChange={(e) => setForm((p) => ({ ...p, foto: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-misti-orange"
                />
              </div>

              <div>
                <label htmlFor="setup-video" className="block text-sm font-medium text-gray-700 mb-1">
                  URL do video (YouTube embed)
                </label>
                <input
                  id="setup-video"
                  type="url"
                  placeholder="https://youtube.com/embed/..."
                  value={form.video}
                  onChange={(e) => setForm((p) => ({ ...p, video: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-misti-orange"
                />
              </div>

              {/* Mensagem pessoal */}
              <div>
                <label htmlFor="setup-mensagem" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem pessoal
                </label>
                <textarea
                  id="setup-mensagem"
                  maxLength={200}
                  rows={3}
                  placeholder="Ex: Fiquei aqui em janeiro e o cafe da manha com vista me conquistou!"
                  value={form.mensagemPessoal}
                  onChange={(e) => setForm((p) => ({ ...p, mensagemPessoal: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-misti-orange resize-none"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-gray-400 text-xs">
                    {parceiro?.mensagemAprovada
                      ? "Aprovada pelo staff - visivel na sua pagina"
                      : form.mensagemPessoal
                        ? "Pendente de aprovacao pelo staff"
                        : "Escreva algo pessoal sobre sua experiencia"
                    }
                  </p>
                  <span className="text-gray-400 text-xs">{form.mensagemPessoal.length}/200</span>
                </div>
              </div>

              {/* Tema visual */}
              <ThemeSelector
                currentTheme={form.tema}
                onSelect={(temaId) => setForm((p) => ({ ...p, tema: temaId }))}
              />

              <button
                type="submit"
                disabled={salvando}
                className="w-full bg-misti-orange hover:bg-misti-orange-dark text-white font-heading font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 mt-2"
              >
                {salvando ? "Salvando..." : "Salvar alteracoes"}
              </button>
            </form>
          </div>

          {/* Dados readonly */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="font-heading font-semibold text-base text-misti-navy mb-4">
                Dados do staff
              </h2>
              <dl className="flex flex-col gap-3">
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wide">Codigo</dt>
                  <dd className="font-mono font-bold text-misti-teal text-lg mt-0.5">{parceiro.codigo}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wide">Desconto</dt>
                  <dd className="font-semibold text-gray-800 mt-0.5">{parceiro.desconto}%</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wide">Validade</dt>
                  <dd className="font-medium text-gray-700 text-sm mt-0.5">{validadeFormatada}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wide">Nicho</dt>
                  <dd className="font-medium text-gray-700 text-sm mt-0.5">
                    {getNichoLabel(parceiro.nicho)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wide">Status</dt>
                  <dd className="mt-0.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        parceiro.ativo
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {parceiro.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </dd>
                </div>
              </dl>
              <p className="text-gray-400 text-xs mt-4">
                Para alterar codigo, desconto ou validade, fale com o staff.
              </p>
            </div>

            {/* Preview link */}
            <div className="bg-misti-teal-light rounded-2xl p-5">
              <p className="text-misti-navy text-sm font-medium mb-2">Link da sua pagina</p>
              <Link
                href={`/${parceiro.slug}`}
                target="_blank"
                className="text-misti-teal text-xs break-all hover:underline"
              >
                /{parceiro.slug}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
