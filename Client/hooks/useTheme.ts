import { useThemeStore } from "@/store/themeStore";
import { LightColors, DarkColors, ThemeColors } from "@/constants";

export function useTheme() {
  const mode = useThemeStore((s) => s.mode);
  const toggle = useThemeStore((s) => s.toggle);

  const colors: ThemeColors = mode === "dark" ? DarkColors : LightColors;
  const isDark = mode === "dark";

  return { colors, isDark, mode, toggleTheme: toggle } as const;
}
