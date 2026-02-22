export interface ThemePalette {
  id: string;
  nome: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  accentLight: string;
  dark: string;
  warm: string;
}

export const themes: Record<string, ThemePalette> = {
  "misti-original": {
    id: "misti-original",
    nome: "El Misti Original",
    primary: "#FD8000",
    primaryDark: "#DB6F00",
    primaryLight: "#FFB366",
    accent: "#00B5B8",
    accentLight: "#D7F2F1",
    dark: "#0A2540",
    warm: "#F5F5F5",
  },
  "ocean-blue": {
    id: "ocean-blue",
    nome: "Ocean Blue",
    primary: "#0077B6",
    primaryDark: "#005F8A",
    primaryLight: "#90E0EF",
    accent: "#00B4D8",
    accentLight: "#CAF0F8",
    dark: "#03045E",
    warm: "#F0F7FA",
  },
  "tropical-green": {
    id: "tropical-green",
    nome: "Tropical Green",
    primary: "#2D9B4E",
    primaryDark: "#1E7A3A",
    primaryLight: "#A8E6C3",
    accent: "#F4A300",
    accentLight: "#FFF3D6",
    dark: "#1A3C2A",
    warm: "#F2F9F5",
  },
  "sunset-pink": {
    id: "sunset-pink",
    nome: "Sunset Pink",
    primary: "#E84393",
    primaryDark: "#C2185B",
    primaryLight: "#FDCFE8",
    accent: "#FD7B38",
    accentLight: "#FFF0E8",
    dark: "#2D1B3D",
    warm: "#FDF2F8",
  },
  "royal-purple": {
    id: "royal-purple",
    nome: "Royal Purple",
    primary: "#7C3AED",
    primaryDark: "#5B21B6",
    primaryLight: "#C4B5FD",
    accent: "#06B6D4",
    accentLight: "#E0F7FA",
    dark: "#1E1B4B",
    warm: "#F5F3FF",
  },
  "desert-gold": {
    id: "desert-gold",
    nome: "Desert Gold",
    primary: "#D4A017",
    primaryDark: "#B8860B",
    primaryLight: "#F5E6A3",
    accent: "#C65D3E",
    accentLight: "#FDEEE8",
    dark: "#3E2723",
    warm: "#FFFBF0",
  },
  "forest": {
    id: "forest",
    nome: "Forest",
    primary: "#059669",
    primaryDark: "#047857",
    primaryLight: "#A7F3D0",
    accent: "#84CC16",
    accentLight: "#ECFCCB",
    dark: "#14332A",
    warm: "#F0FDF4",
  },
  "cherry-red": {
    id: "cherry-red",
    nome: "Cherry Red",
    primary: "#DC2626",
    primaryDark: "#B91C1C",
    primaryLight: "#FCA5A5",
    accent: "#F59E0B",
    accentLight: "#FEF3C7",
    dark: "#1C1917",
    warm: "#FEF2F2",
  },
  "midnight": {
    id: "midnight",
    nome: "Midnight",
    primary: "#3B82F6",
    primaryDark: "#2563EB",
    primaryLight: "#BFDBFE",
    accent: "#8B5CF6",
    accentLight: "#EDE9FE",
    dark: "#0F172A",
    warm: "#F1F5F9",
  },
  "lavender": {
    id: "lavender",
    nome: "Lavender",
    primary: "#A855F7",
    primaryDark: "#7E22CE",
    primaryLight: "#E9D5FF",
    accent: "#EC4899",
    accentLight: "#FCE7F3",
    dark: "#2E1065",
    warm: "#FAF5FF",
  },
};

export const themeList = Object.values(themes);

export function getTheme(id: string): ThemePalette {
  return themes[id] ?? themes["misti-original"];
}
