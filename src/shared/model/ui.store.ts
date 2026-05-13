import { create } from 'zustand'

interface UIStore {
    isSplashVisible: boolean
    showSplash: () => void
    hideSplash: () => void
}



export const useUIStore = create<UIStore>((set) => ({
    isSplashVisible: false,
    showSplash: () => set({ isSplashVisible: true }),
    hideSplash: () => set({ isSplashVisible: false }),
}))

