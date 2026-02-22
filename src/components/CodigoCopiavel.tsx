"use client";

import { useState } from "react";

interface Props {
  codigo: string;
  themeColor?: string;
}

export default function CodigoCopiavel({ codigo, themeColor = "#00B5B8" }: Props) {
  const [copiado, setCopiado] = useState(false);

  function handleCopiar() {
    navigator.clipboard.writeText(codigo).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  return (
    <button
      onClick={handleCopiar}
      aria-label={copiado ? "Codigo copiado" : "Copiar codigo de desconto"}
      className="flex items-center gap-3 rounded-xl px-5 py-3 transition-all duration-200 group w-fit border-2 border-dashed"
      style={{ borderColor: themeColor, backgroundColor: `${themeColor}10` }}
    >
      <span className="font-mono font-bold text-xl tracking-wider" style={{ color: themeColor }}>
        {codigo}
      </span>
      <span className="text-sm transition-colors" style={{ color: `${themeColor}B0` }}>
        {copiado ? "Copiado!" : "Toque para copiar"}
      </span>
      {copiado ? (
        <svg className="w-5 h-5" fill="none" stroke={themeColor} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke={themeColor} strokeOpacity={0.6} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}
