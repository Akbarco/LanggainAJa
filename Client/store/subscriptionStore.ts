import { create } from "zustand";
import {
  Subscription,
  SubscriptionSummary,
  CreateSubscriptionPayload,
  UpdateSubscriptionPayload,
  PaymentLog,
} from "@/types";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { scheduleSubscriptionReminders, cancelSubscriptionReminders } from "@/lib/notifications";

interface SubscriptionState {
  subscriptions: Subscription[];
  summary: SubscriptionSummary | null;
  paymentHistory: PaymentLog[];
  isLoading: boolean;
  isRefreshing: boolean;

  // Actions
  fetchSubscriptions: () => Promise<void>;
  fetchSummary: () => Promise<void>;
  createSubscription: (payload: CreateSubscriptionPayload) => Promise<Subscription>;
  updateSubscription: (id: string, payload: UpdateSubscriptionPayload) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  toggleActive: (id: string, isActive: boolean) => Promise<void>;
  markAsPaid: (id: string, note?: string) => Promise<void>;
  fetchPaymentHistory: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscriptions: [],
  summary: null,
  paymentHistory: [],
  isLoading: false,
  isRefreshing: false,

  fetchSubscriptions: async () => {
    set({ isLoading: true });
    try {
      const res = await apiGet<Subscription[]>("/subscriptions");
      set({ subscriptions: res.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchSummary: async () => {
    try {
      const res = await apiGet<SubscriptionSummary>("/subscriptions/summary");
      set({ summary: res.data });
    } catch {
      // Silently fail for summary
    }
  },

  createSubscription: async (payload: CreateSubscriptionPayload) => {
    const res = await apiPost<Subscription>("/subscriptions", payload as any);
    set((state) => ({
      subscriptions: [res.data, ...state.subscriptions],
    }));

    // [FITUR BARU] Jadwalkan notifikasi H-7 dan H-1
    try {
      await scheduleSubscriptionReminders({
        id: res.data.id,
        name: res.data.name,
        price: res.data.price,
        currency: res.data.currency as any || "IDR",
        nextPaymentDate: res.data.nextPaymentDate,
      });
    } catch (e) {
      console.log("Gagal buat notifikasi", e);
    }

    return res.data;
  },

  updateSubscription: async (id: string, payload: UpdateSubscriptionPayload) => {
    const res = await apiPut<Subscription>(`/subscriptions/${id}`, payload as any);
    set((state) => ({
      subscriptions: state.subscriptions.map((s) =>
        s.id === id ? res.data : s
      ),
    }));

    // Update notifikasi jika datanya berubah
    try {
      await scheduleSubscriptionReminders({
        id: res.data.id,
        name: res.data.name,
        price: res.data.price,
        currency: res.data.currency as any || "IDR",
        nextPaymentDate: res.data.nextPaymentDate,
      });
    } catch (e) {
      console.log("Gagal buat notifikasi", e);
    }
  },

  deleteSubscription: async (id: string) => {
    await apiDelete(`/subscriptions/${id}`);
    set((state) => ({
      subscriptions: state.subscriptions.filter((s) => s.id !== id),
    }));

    // Batalin semua alarm sisa kalau langganan dihapus (Arsip)
    try {
      await cancelSubscriptionReminders(id);
    } catch (e) {
      console.log("Gagal membatalkan notifikasi", e);
    }
  },

  toggleActive: async (id: string, isActive: boolean) => {
    await get().updateSubscription(id, { isActive });
  },

  markAsPaid: async (id: string, note?: string) => {
    await apiPost(`/subscriptions/${id}/pay`, { note } as any);
    // Refresh subscription list to get updated nextPaymentDate
    await get().fetchSubscriptions();
    await get().fetchSummary();
  },

  fetchPaymentHistory: async (id: string) => {
    try {
      const res = await apiGet<PaymentLog[]>(`/subscriptions/${id}/payments`);
      set({ paymentHistory: res.data });
    } catch {
      set({ paymentHistory: [] });
    }
  },

  refresh: async () => {
    set({ isRefreshing: true });
    try {
      await Promise.all([get().fetchSubscriptions(), get().fetchSummary()]);
    } finally {
      set({ isRefreshing: false });
    }
  },
}));
