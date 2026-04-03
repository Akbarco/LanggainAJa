import { create } from "zustand";
import { storage } from "@/lib/storage";

export type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
  isReady: boolean;
  initialize: () => Promise<void>;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggle: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: "light",
  isReady: false,

  initialize: async () => {
    try {
      const saved = await storage.getItem("themeMode");
      set({
        mode: (saved === "dark" ? "dark" : "light") as ThemeMode,
        isReady: true,
      });
    } catch {
      set({ isReady: true });
    }
  },

  setMode: async (mode: ThemeMode) => {
    await storage.setItem("themeMode", mode);
    set({ mode });
  },

  toggle: async () => {
    const next: ThemeMode = get().mode === "light" ? "dark" : "light";
    await storage.setItem("themeMode", next);
    set({ mode: next });
  },
}));
