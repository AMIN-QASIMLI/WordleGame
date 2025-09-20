import { create } from "zustand";

interface State {
  try: number;
  increaseTry: () => void;
  resetTries: () => void;
}

export const userTries = create<State>((set) => ({
  try: 0,
  increaseTry: () => set((state) => ({ try: state.try + 1 })),
  resetTries: () => set(() => ({ try: 0 })),
}));
