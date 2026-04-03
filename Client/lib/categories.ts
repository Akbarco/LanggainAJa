import { Ionicons } from "@expo/vector-icons";
import { CategoryType } from "@/types";

export interface CategoryInfo {
  key: CategoryType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const CATEGORY_DATA: Omit<CategoryInfo, "bgColor">[] = [
  { key: "ENTERTAINMENT", label: "Hiburan", icon: "film-outline", color: "#EA580C" },
  { key: "UTILITY", label: "Utilitas", icon: "flash-outline", color: "#D97706" },
  { key: "FINANCE", label: "Keuangan", icon: "card-outline", color: "#059669" },
  { key: "EDUCATION", label: "Edukasi", icon: "school-outline", color: "#2563EB" },
  { key: "GAMING", label: "Gaming", icon: "game-controller-outline", color: "#7C3AED" },
  { key: "OTHER", label: "Lainnya", icon: "grid-outline", color: "#4F46E5" },
];

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

export type CategoryInfoFull = CategoryInfo & { bgColor: string };

function buildCategories(isDark: boolean): CategoryInfoFull[] {
  const opacity = isDark ? 0.18 : 0.08;
  return CATEGORY_DATA.map((cat) => ({
    ...cat,
    bgColor: hexToRgba(cat.color, opacity),
  }));
}

export const LIGHT_CATEGORIES = buildCategories(false);
export const DARK_CATEGORIES = buildCategories(true);

// Default export for backward compat
export const CATEGORIES = LIGHT_CATEGORIES;

export function getCategoryInfo(key: CategoryType, isDark = false): CategoryInfoFull {
  const list = isDark ? DARK_CATEGORIES : LIGHT_CATEGORIES;
  return list.find((c) => c.key === key) || list[list.length - 1];
}

export function getCategories(isDark: boolean): CategoryInfoFull[] {
  return isDark ? DARK_CATEGORIES : LIGHT_CATEGORIES;
}
