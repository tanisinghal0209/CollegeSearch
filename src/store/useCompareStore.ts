import { create } from "zustand";
import { College } from "@/lib/mockData";

interface CompareState {
  colleges: College[];
  addCollege: (college: College) => boolean; // returns true if added, false if already present or full
  removeCollege: (id: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  colleges: [],
  addCollege: (college) => {
    const current = get().colleges;
    if (current.some((c) => c.id === college.id)) {
      return false;
    }
    if (current.length >= 3) {
      return false;
    }
    set({ colleges: [...current, college] });
    return true;
  },
  removeCollege: (id) => {
    set({ colleges: get().colleges.filter((c) => c.id !== id) });
  },
  clear: () => set({ colleges: [] }),
}));
