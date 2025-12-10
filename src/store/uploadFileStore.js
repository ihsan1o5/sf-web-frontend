import { create } from "zustand";

export const useUploadFileStore = create((set) => ({
  refreshKey: 0,
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 }))
}));
