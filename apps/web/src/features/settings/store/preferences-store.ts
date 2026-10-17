import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PreferencesState {
  slippageTolerance: number;
  setSlippageTolerance: (value: number) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      slippageTolerance: 0.5,
      setSlippageTolerance: (value: number) => {
        if (value < 0.1 || value > 50 || isNaN(value)) {
          return;
        }
        set({ slippageTolerance: value });
      },
    }),
    {
      name: "preferences-storage",
    }
  )
);
