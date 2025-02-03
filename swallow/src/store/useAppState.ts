import { create } from 'zustand';

interface AppState {
  currentScene: string;
  setCurrentScene: (scene: string) => void;

  userPainText: string;
  setUserPainText: (text: string) => void;
}

export const useAppState = create<AppState>()((set) => ({
  currentScene: 'NONE',  // or 'TUNNEL' if you want to show it by default
  setCurrentScene: (scene) => set({ currentScene: scene }),

  userPainText: '',
  setUserPainText: (text) => set({ userPainText: text }),
}));
