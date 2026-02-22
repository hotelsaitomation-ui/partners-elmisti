"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/admin";

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [entrando, setEntrando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEntrando(true);
    setErro(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });

      if (!res.ok) {
        setErro("Usuario ou senha incorretos.");
        return;
      }

      router.push(redirect);
    } catch {
      setErro("Erro de conexao. Tente novamente.");
    } finally {
      setEntrando(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-5"
    >
      <div>
        <label htmlFor="login-user" className="block text-sm font-medium text-gray-700 mb-1">
          Usuario
        </label>
        <input
          id="login-user"
          type="text"
          required
          autoFocus
          autoComplete="username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-misti-orange"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
          Senha
        </label>
        <input
          id="login-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-misti-orange"
        />
      </div>

      {erro && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm font-medium">
          {erro}
        </div>
      )}

      <button
        type="submit"
        disabled={entrando}
        className="w-full bg-misti-orange hover:bg-misti-orange-dark text-white font-heading font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
      >
        {entrando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-misti-navy to-misti-navy/90 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-3xl text-white">El Misti</h1>
          <p className="text-white/50 text-sm mt-1">Painel de Parceiros</p>
        </div>

        <Suspense fallback={
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center text-gray-400">
            Carregando...
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
