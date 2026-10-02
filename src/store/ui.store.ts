import { create } from 'zustand';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

interface UIState {
  activeModal: string | null;
  toasts: ToastMessage[];
  openModal: (modalId: string) => void;
  closeModal: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => string;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  activeModal: null,
  toasts: [],
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    return id;
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export type ToastInput = Omit<ToastMessage, 'id' | 'type'> & { duration?: number };

export const toast = {
  success: (input: string | ToastInput) => {
    const payload = typeof input === 'string' ? { title: input } : input;
    return useUIStore.getState().addToast({ type: 'success', ...payload });
  },
  error: (input: string | ToastInput) => {
    const payload = typeof input === 'string' ? { title: input } : input;
    return useUIStore.getState().addToast({ type: 'error', ...payload });
  },
  info: (input: string | ToastInput) => {
    const payload = typeof input === 'string' ? { title: input } : input;
    return useUIStore.getState().addToast({ type: 'info', ...payload });
  },
  warning: (input: string | ToastInput) => {
    const payload = typeof input === 'string' ? { title: input } : input;
    return useUIStore.getState().addToast({ type: 'warning', ...payload });
  },
  dismiss: (id: string) => {
    useUIStore.getState().removeToast(id);
  },
};

