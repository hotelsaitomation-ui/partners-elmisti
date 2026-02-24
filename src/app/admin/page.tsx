"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Influencer } from "@/types/partner";
import ThemeSelector from "@/components/ThemeSelector";
import { getTheme } from "@/data/themes";
import { activeProperties, getProperty } from "@/data/properties";
import { nichoLabels } from "@/data/nichos";
import { gerarSlug } from "@/lib/utils";
import type { ConteudoPagina } from "@/lib/conteudo";

interface NovoParceiroForm {
  nome: string;
  handle: string;
  slug: string;
  foto: string;
  video: string;
  nicho: string;
  codigo: string;
  desconto: string;
  validade: string;
  tema: string;
  propriedade: string;
}

const formVazio: NovoParceiroForm = {
  nome: "",
  handle: "",
  slug: "",
  foto: "",
  video: "",
  nicho: "mochileiro",
  codigo: "",
  desconto: "",
  validade: "",
  tema: "misti-original",
  propriedade: "misti-ipa",
};

const CONTEUDO_CAMPOS: { key: keyof ConteudoPagina; label: string; multiline?: boolean }[] = [
  { key: "heroTitulo", label: "Titulo do Hero" },
  { key: "heroDescricao", label: "Descricao do Hero", multiline: true },
  { key: "bookingScore", label: "Nota Booking.com" },
  { key: "googleScore", label: "Nota Google" },
  { key: "tripAdvisorRank", label: "Ranking TripAdvisor" },
  { key: "ctaTitulo", label: "Titulo do CTA final" },
  { key: "ctaWhatsappTexto", label: "Texto do link WhatsApp" },
  { key: "whatsapp", label: "Numero WhatsApp (so digitos)" },
];

export default function AdminPage() {
  const [parceiros, setParceiros] = useState<Influencer[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState<NovoParceiroForm>(formVazio);
  const [salvando, setSalvando] = useState(false);
  const [feedbackSalvo, setFeedbackSalvo] = useState<string | null>(null);

  // Editor de conteudo
  const [abaConteudo, setAbaConteudo] = useState<"global" | string>("global");
  const [conteudoForm, setConteudoForm] = useState<Partial<ConteudoPagina>>({});
  const [conteudoCarregando, setConteudoCarregando] = useState(false);
  const [conteudoSalvando, setConteudoSalvando] = useState(false);
  const [conteudoFeedback, setConteudoFeedback] = useState<string | null>(null);

  const buscarParceiros = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch("/api/partners?all=true");
      if (!res.ok) throw new Error("Falha ao buscar parceiros");
      const dados: Influencer[] = await res.json();
      setParceiros(dados);
    } catch {
      setErro("Nao foi possivel carregar a lista de parceiros.");
    } finally {
      setCarregando(false);
    }
  }, []);

  const buscarConteudo = useCallback(async (aba: string) => {
    setConteudoCarregando(true);
    setConteudoFeedback(null);
    try {
      const url = aba === "global"
        ? "/api/conteudo"
        : `/api/conteudo?propriedade=${aba}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Falha ao buscar conteudo");
      const dados = await res.json();
      setConteudoForm(dados.conteudo ?? {});
    } catch {
      setConteudoFeedback("Erro ao carregar conteudo");
    } finally {
      setConteudoCarregando(false);
    }
  }, []);

  async function salvarConteudo() {
    setConteudoSalvando(true);
    setConteudoFeedback(null);
    try {
      const res = await fetch("/api/conteudo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propriedade: abaConteudo === "global" ? undefined : abaConteudo,
          conteudo: conteudoForm,
        }),
      });
      if (!res.ok) throw new Error("Falha ao salvar");
      setConteudoFeedback("Conteudo salvo com sucesso!");
    } catch {
      setConteudoFeedback("Erro ao salvar conteudo");
    } finally {
      setConteudoSalvando(false);
    }
  }

  async function toggleAprovacao(slug: string, aprovado: boolean) {
    try {
      const res = await fetch(`/api/partners/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagemAprovada: !aprovado }),
      });
      if (!res.ok) throw new Error("Falha");
      await buscarParceiros();
    } catch {
      setFeedbackSalvo("Erro ao atualizar aprovacao");
    }
  }

  async function toggleAtivo(slug: string, ativo: boolean) {
    try {
      const res = await fetch(`/api/partners/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ativo: !ativo }),
      });
      if (!res.ok) throw new Error("Falha");
      await buscarParceiros();
    } catch {
      setFeedbackSalvo("Erro ao atualizar status");
    }
  }

  useEffect(() => {
    buscarParceiros();
  }, [buscarParceiros]);

  useEffect(() => {
    buscarConteudo(abaConteudo);
  }, [abaConteudo, buscarConteudo]);

  function handleNomeChange(value: string) {
    setForm((prev) => ({
      ...prev,
      nome: value,
      slug: gerarSlug(value),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setFeedbackSalvo(null);

    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          foto: form.foto || "",
          video: form.video || null,
          desconto: Number(form.desconto),
          tema: form.tema,
          propriedade: form.propriedade,
          ativo: true,
        }),
      });

      if (!res.ok) {
        const dados = await res.json();
        throw new Error(dados.error || "Falha ao criar parceiro");
      }

      setFeedbackSalvo("Parceiro criado com sucesso!");
      setForm(formVazio);
      setMostrarForm(false);
      await buscarParceiros();
    } catch (err: any) {
      setFeedbackSalvo(`Erro: ${err.message}`);
    } finally {
      setSalvando(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-misti-gray-warm">
      {/* Header */}
      <header className="bg-misti-navy px-4 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <span className="font-heading font-bold text-xl text-white">El Misti</span>
            <span className="text-white/50 ml-2 text-sm">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors">
              Ver site
            </Link>
            <button
              onClick={handleLogout}
              className="text-white/40 hover:text-white text-sm transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading font-bold text-2xl text-misti-navy">Parceiros</h1>
          <button
            onClick={() => {
              setMostrarForm((v) => !v);
              setFeedbackSalvo(null);
            }}
            className="bg-misti-orange hover:bg-misti-orange-dark text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            {mostrarForm ? "Cancelar" : "+ Novo Parceiro"}
          </button>
        </div>

        {/* Feedback global */}
        {feedbackSalvo && (
          <div
            className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium ${
              feedbackSalvo.startsWith("Erro")
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {feedbackSalvo}
          </div>
        )}

        {/* Formulario novo parceiro */}
        {mostrarForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="font-heading font-semibold text-lg text-misti-navy mb-6">Novo parceiro</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div>
                <label htmlFor="adm-nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  id="adm-nome"
                  type="text"
                  required
                  value={form.nome}
                  onChange={(e) => handleNomeChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-misti-orange"
                />
              </div>

              {/* Handle */}
              <div>
                <label htmlFor="adm-handle" className="block text-sm font-medium text-gray-700 mb-1">
                  Handle <span className="text-red-500">*</span>
                </label>
                <input
                  id="adm-handle"
                  type="text"
                  required
                  placeholder="@handle"
                  value={form.handle}
                  onChange={(e) => setForm((p) => ({ ...p, handle: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-misti-orange"
                />
              </div>

              {/* Slug */}
              <div>
                <label htmlFor="adm-slug" className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (auto-gerado)
                </label>
                <input
                  id="adm-slug"
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-misti-orange"
                />
              </div>

              {/* Nicho */}
              <div>
                <label htmlFor="adm-nicho" className="block text-sm font-medium text-gray-700 mb-1">
                  Nicho <span className="text-red-500">*</span>
                </label>
                <select
                  id="adm-nicho"
                  required
                  value={form.nicho}
                  onChange={(e) => setForm((p) => ({ ...p, nicho: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-misti-orange"
                >
                  {nichoLabels.map((n) => (
                    <option key={n.value} value={n.value}>{n.label}</option>
                  ))}
                </select>
              </div>

              {/* Propriedade */}
              <div>
                <label htmlFor="adm-propriedade" className="block text-sm font-medium text-gray-700 mb-1">
                  Propriedade <span className="text-red-500">*</span>
                </label>
                <select
                  id="adm-propriedade"
                  required
                  value={form.propriedade}
                  onChange={(e) => setForm((p) => ({ ...p, propriedade: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-misti-orange"
                >
                  {activeProperties.map((prop) => (
                    <option key={prop.id} value={prop.id}>
                      {prop.nome} ({prop.cidade})
                    </option>
                  ))}
                </select>
              </div>

              {/* Codigo */}
              <div>
                <label htmlFor="adm-codigo" className="block text-sm font-medium text-gray-700 mb-1">
                  Codigo <span className="text-red-500">*</span>
                </label>
                <input
                  id="adm-codigo"
                  type="text"
                  required
                  placeholder="CODIGO10"
                  value={form.codigo}
                  onChange={(e) => setForm((p) => ({ ...p, codigo: e.target.value.toUpperCase() }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-misti-orange"
                />
              </div>

              {/* Desconto */}
              <div>
                <label htmlFor="adm-desconto" className="block text-sm font-medium text-gray-700 mb-1">
                  Desconto (%) <span className="text-red-500">*</span>
                </label>
                <input
                  id="adm-desconto"
                  type="number"
                  required
                  min={1}
                  max={100}
                  placeholder="10"
                  value={form.desconto}
                  onChange={(e) => setForm((p) => ({ ...p, desconto: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-misti-orange"
                />
              </div>

              {/* Validade */}
              <div>
                <label htmlFor="adm-validade" className="block text-sm font-medium text-gray-700 mb-1">
                  Validade <span className="text-red-500">*</span>
                </label>
                <input
                  id="adm-validade"
                  type="date"
                  required
                  value={form.validade}
                  onChange={(e) => setForm((p) => ({ ...p, validade: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-misti-orange"
                />
              </div>

              {/* Foto URL */}
              <div>
                <label htmlFor="adm-foto" className="block text-sm font-medium text-gray-700 mb-1">
                  URL da foto
                </label>
                <input
                  id="adm-foto"
                  type="url"
                  placeholder="https://..."
                  value={form.foto}
                  onChange={(e) => setForm((p) => ({ ...p, foto: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-misti-orange"
                />
              </div>

              {/* Video URL */}
              <div className="md:col-span-2">
                <label htmlFor="adm-video" className="block text-sm font-medium text-gray-700 mb-1">
                  URL do video (YouTube embed)
                </label>
                <input
                  id="adm-video"
                  type="url"
                  placeholder="https://youtube.com/embed/..."
                  value={form.video}
                  onChange={(e) => setForm((p) => ({ ...p, video: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-misti-orange"
                />
              </div>

              {/* Tema visual */}
              <div className="md:col-span-2">
                <ThemeSelector
                  currentTheme={form.tema}
                  onSelect={(temaId) => setForm((p) => ({ ...p, tema: temaId }))}
                />
              </div>

              {/* Acoes */}
              <div className="md:col-span-2 flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => { setMostrarForm(false); setForm(formVazio); }}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="px-5 py-2.5 rounded-xl bg-misti-orange hover:bg-misti-orange-dark text-white text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  {salvando ? "Salvando..." : "Criar parceiro"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de parceiros */}
        {carregando ? (
          <div className="text-center py-20 text-gray-400">Carregando parceiros...</div>
        ) : erro ? (
          <div className="text-center py-20 text-red-500">{erro}</div>
        ) : parceiros.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Nenhum parceiro cadastrado.</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-misti-gray-warm">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Parceiro</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700 hidden md:table-cell">Nicho</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Codigo</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700 hidden md:table-cell">Unidade</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700 hidden lg:table-cell">Tema</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700 hidden sm:table-cell">Desconto</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700 hidden lg:table-cell">Msg</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-700">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {parceiros.map((p) => {
                  const nichoLabel = nichoLabels.find((n) => n.value === p.nicho)?.label ?? p.nicho;
                  return (
                    <tr key={p.slug} className="hover:bg-misti-gray-warm/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-medium text-gray-900">{p.nome}</span>
                        <span className="text-gray-400 ml-2">{p.handle}</span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-gray-600">{nichoLabel}</td>
                      <td className="px-5 py-4 font-mono font-semibold text-misti-teal">{p.codigo}</td>
                      <td className="px-5 py-4 hidden md:table-cell text-gray-600 text-xs">
                        {getProperty(p.propriedade ?? "misti-ipa")?.nome ?? p.propriedade}
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: getTheme(p.tema ?? "misti-original").primary }}
                          />
                          <span className="text-gray-600 text-xs">{getTheme(p.tema ?? "misti-original").nome}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell text-gray-600">{p.desconto}%</td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        {p.mensagemPessoal ? (
                          <button
                            onClick={() => toggleAprovacao(p.slug, p.mensagemAprovada)}
                            title={p.mensagemPessoal}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                              p.mensagemAprovada
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            }`}
                          >
                            {p.mensagemAprovada ? "Aprovada" : "Pendente"}
                          </button>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => toggleAtivo(p.slug, p.ativo)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                            p.ativo
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {p.ativo ? "Ativo" : "Inativo"}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-3">
                          <Link
                            href={`/${p.slug}`}
                            target="_blank"
                            className="text-misti-teal hover:underline text-xs font-medium"
                          >
                            Ver pagina
                          </Link>
                          <Link
                            href={`/setup/${p.slug}`}
                            className="text-misti-orange hover:underline text-xs font-medium"
                          >
                            Editar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {/* Editor de Conteudo */}
        <div className="mt-12">
          <h2 className="font-heading font-bold text-2xl text-misti-navy mb-6">Conteudo da pagina</h2>

          {/* Abas: Global + cada propriedade */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setAbaConteudo("global")}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                abaConteudo === "global"
                  ? "bg-misti-navy text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Global (padrao)
            </button>
            {activeProperties.map((prop) => (
              <button
                key={prop.id}
                onClick={() => setAbaConteudo(prop.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  abaConteudo === prop.id
                    ? "bg-misti-navy text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {prop.nome}
              </button>
            ))}
          </div>

          {abaConteudo !== "global" && (
            <p className="text-gray-500 text-sm mb-4">
              Campos em branco usam o valor global. Preencha apenas o que quiser sobrescrever para esta propriedade.
            </p>
          )}

          {conteudoCarregando ? (
            <div className="text-center py-10 text-gray-400">Carregando conteudo...</div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              {conteudoFeedback && (
                <div
                  className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium ${
                    conteudoFeedback.startsWith("Erro")
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-green-50 text-green-700 border border-green-200"
                  }`}
                >
                  {conteudoFeedback}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CONTEUDO_CAMPOS.map((campo) => (
                  <div key={campo.key} className={campo.multiline ? "md:col-span-2" : ""}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {campo.label}
                    </label>
                    {campo.multiline ? (
                      <textarea
                        rows={3}
                        value={(conteudoForm[campo.key] as string) ?? ""}
                        onChange={(e) =>
                          setConteudoForm((prev) => ({ ...prev, [campo.key]: e.target.value }))
                        }
                        placeholder={abaConteudo !== "global" ? "(usa valor global)" : ""}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-misti-orange resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={(conteudoForm[campo.key] as string) ?? ""}
                        onChange={(e) =>
                          setConteudoForm((prev) => ({ ...prev, [campo.key]: e.target.value }))
                        }
                        placeholder={abaConteudo !== "global" ? "(usa valor global)" : ""}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-misti-orange"
                      />
                    )}
                  </div>
                ))}
              </div>

              {abaConteudo === "global" && (
                <p className="text-gray-400 text-xs mt-4">
                  Variaveis disponiveis: {"{handle}"} {"{desconto}"} {"{codigo}"} — substituidas automaticamente por parceiro.
                </p>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={salvarConteudo}
                  disabled={conteudoSalvando}
                  className="px-6 py-2.5 rounded-xl bg-misti-orange hover:bg-misti-orange-dark text-white text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  {conteudoSalvando ? "Salvando..." : "Salvar conteudo"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
