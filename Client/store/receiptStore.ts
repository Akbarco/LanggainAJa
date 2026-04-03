import { create } from "zustand";
import { storage } from "@/lib/storage";

interface ReceiptState {
  receipts: Record<string, string>; // { subscriptionId: imageUri }
  isReady: boolean;
  initialize: () => Promise<void>;
  setReceipt: (id: string, uri: string) => Promise<void>;
  removeReceipt: (id: string) => Promise<void>;
}

export const useReceiptStore = create<ReceiptState>((set, get) => ({
  receipts: {},
  isReady: false,

  initialize: async () => {
    try {
      const stored = await storage.getItem("receipts_v1");
      if (stored) {
        set({ receipts: JSON.parse(stored), isReady: true });
      } else {
        set({ isReady: true });
      }
    } catch {
      set({ isReady: true });
    }
  },

  setReceipt: async (id: string, uri: string) => {
    const newReceipts = { ...get().receipts, [id]: uri };
    await storage.setItem("receipts_v1", JSON.stringify(newReceipts));
    set({ receipts: newReceipts });
  },

  removeReceipt: async (id: string) => {
    const newReceipts = { ...get().receipts };
    delete newReceipts[id];
    await storage.setItem("receipts_v1", JSON.stringify(newReceipts));
    set({ receipts: newReceipts });
  },
}));
