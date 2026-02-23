"use client";

import { useState } from "react";

type Step = 1 | 2 | 3;

interface FormData {
  nome: string;
  email: string;
  handle: string;
  plataforma: string;
  motivacao: string;
}

const PLATAFORMAS = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "blog", label: "Blog / Site" },
  { value: "outro", label: "Outro" },
];

export default function SmartForm() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>({
    nome: "",
    email: "",
    handle: "",
    plataforma: "",
    motivacao: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  function validateStep(s: Step): boolean {
    if (s === 1) {
      if (!form.nome.trim()) {
        setError("Informe seu nome");
        return false;
      }
      if (!form.email.trim() || !form.email.includes("@")) {
        setError("Informe um email valido");
        return false;
      }
    }
    if (s === 2) {
      if (!form.handle.trim()) {
        setError("Informe seu @ ou link do perfil");
        return false;
      }
      if (!form.plataforma) {
        setError("Selecione uma plataforma");
        return false;
      }
    }
    return true;
  }

  function nextStep() {
    if (!validateStep(step)) return;
    setStep((prev) => Math.min(prev + 1, 3) as Step);
  }

  function prevStep() {
    setStep((prev) => Math.max(prev - 1, 1) as Step);
    setError("");
  }

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao enviar");
      }
      setSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Erro ao enviar. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
        <div className="w-16 h-16 bg-misti-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-misti-teal"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="font-heading font-bold text-2xl text-misti-navy mb-3">
          Recebemos sua candidatura!
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Vamos analisar seu perfil com carinho. Se houver fit, entraremos em
          contato pelo email{" "}
          <strong className="text-misti-navy">{form.email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-heading font-bold transition-colors ${
                s <= step
                  ? "bg-misti-orange text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {s < step ? (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                s
              )}
            </div>
            {s < 3 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors ${
                  s < step ? "bg-misti-orange" : "bg-gray-100"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Nome + Email */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h3 className="font-heading font-bold text-xl text-misti-navy mb-1">
              Vamos comecar
            </h3>
            <p className="text-gray-500 text-sm">Como podemos te chamar?</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nome completo
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => update("nome", e.target.value)}
              placeholder="Seu nome"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-misti-orange focus:ring-2 focus:ring-misti-orange/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-misti-orange focus:ring-2 focus:ring-misti-orange/20 outline-none transition-all"
            />
          </div>
        </div>
      )}

      {/* Step 2: Handle + Plataforma */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h3 className="font-heading font-bold text-xl text-misti-navy mb-1">
              Seu perfil
            </h3>
            <p className="text-gray-500 text-sm">Onde voce cria conteudo?</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              @ ou link do perfil
            </label>
            <input
              type="text"
              value={form.handle}
              onChange={(e) => update("handle", e.target.value)}
              placeholder="@seuperfil"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-misti-orange focus:ring-2 focus:ring-misti-orange/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Plataforma principal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PLATAFORMAS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => update("plataforma", p.value)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    form.plataforma === p.value
                      ? "border-misti-orange bg-misti-orange/5 text-misti-orange"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Motivacao + Resumo */}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <h3 className="font-heading font-bold text-xl text-misti-navy mb-1">
              Quase la!
            </h3>
            <p className="text-gray-500 text-sm">
              Conte um pouco sobre voce (opcional, mas adoramos conhecer
              melhor).
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Por que voce quer ser parceiro El Misti?
            </label>
            <textarea
              value={form.motivacao}
              onChange={(e) => update("motivacao", e.target.value)}
              placeholder="Compartilhe o que te motiva..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-misti-orange focus:ring-2 focus:ring-misti-orange/20 outline-none transition-all resize-none"
            />
            <p className="text-gray-400 text-xs text-right mt-1">
              {form.motivacao.length}/500
            </p>
          </div>
          <div className="bg-misti-teal-light/50 rounded-xl p-4">
            <p className="text-sm text-misti-navy leading-relaxed">
              <strong>Resumo:</strong> {form.nome} ({form.handle}) &mdash;{" "}
              {PLATAFORMAS.find((p) => p.value === form.plataforma)?.label ??
                form.plataforma}{" "}
              &mdash; {form.email}
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        {step > 1 ? (
          <button
            onClick={prevStep}
            className="text-gray-500 hover:text-gray-700 font-heading text-sm transition-colors"
          >
            Voltar
          </button>
        ) : (
          <div />
        )}
        {step < 3 ? (
          <button
            onClick={nextStep}
            className="bg-misti-orange hover:bg-misti-orange-dark text-white font-heading font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Continuar
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={loading}
            className="bg-misti-orange hover:bg-misti-orange-dark disabled:bg-gray-300 text-white font-heading font-bold px-8 py-3 rounded-xl transition-colors"
          >
            {loading ? "Enviando..." : "Enviar candidatura"}
          </button>
        )}
      </div>
    </div>
  );
}
