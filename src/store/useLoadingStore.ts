import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  loadingText: string | null;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  loadingText: null,
  showLoading: (text) => set({ isLoading: true, loadingText: text || null }),
  hideLoading: () => set({ isLoading: false, loadingText: null }),
}));
