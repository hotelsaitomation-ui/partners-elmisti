"use client";

import { useState, useRef, useEffect } from "react";
import { themeList, type ThemePalette } from "@/data/themes";

interface ThemeSelectorProps {
  currentTheme: string;
  onSelect: (themeId: string) => void;
}

function ThemeCard({
  theme,
  isSelected,
  onClick,
}: {
  theme: ThemePalette;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-36 snap-center rounded-xl overflow-hidden transition-all ${
        isSelected
          ? "ring-4 ring-offset-2 ring-gray-900 scale-105"
          : "ring-1 ring-gray-200 hover:ring-2 hover:ring-gray-400"
      }`}
    >
      {/* Mini preview da paleta */}
      <div className="h-20 relative" style={{ backgroundColor: theme.primary }}>
        <div
          className="absolute bottom-0 left-0 right-0 h-6 rounded-t-lg"
          style={{ backgroundColor: theme.dark }}
        />
        <div
          className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white"
          style={{ backgroundColor: theme.accent }}
        />
        {isSelected && (
          <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke={theme.primary} viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-2 bg-white">
        <div className="flex gap-1 mb-1.5">
          {[theme.primary, theme.primaryDark, theme.accent, theme.dark].map((color, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <p className="text-xs font-medium text-gray-700 text-left truncate">
          {theme.nome}
        </p>
      </div>
    </button>
  );
}

export default function ThemeSelector({ currentTheme, onSelect }: ThemeSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function checkScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }

  useEffect(() => {
    checkScroll();
    // Scroll para o tema selecionado no mount
    const el = scrollRef.current;
    if (!el) return;
    const selectedIndex = themeList.findIndex((t) => t.id === currentTheme);
    if (selectedIndex > 0) {
      const cardWidth = 152; // w-36 (144px) + gap
      el.scrollTo({ left: Math.max(0, selectedIndex * cardWidth - 60), behavior: "smooth" });
    }
  }, [currentTheme]);

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -300 : 300;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tema visual da pagina
      </label>

      {/* Setas de navegacao (desktop) */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 mt-2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-lg rounded-full items-center justify-center hover:bg-gray-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 mt-2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-lg rounded-full items-center justify-center hover:bg-gray-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Carousel horizontal com snap */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {themeList.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isSelected={currentTheme === theme.id}
            onClick={() => onSelect(theme.id)}
          />
        ))}
      </div>

      {/* Indicador de scroll (mobile) */}
      <p className="text-xs text-gray-400 text-center mt-1 md:hidden">
        Deslize para ver mais temas
      </p>
    </div>
  );
}
