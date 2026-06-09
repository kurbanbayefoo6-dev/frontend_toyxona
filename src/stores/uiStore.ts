import { create } from 'zustand'

type UiState = {
	isLoading: boolean
	setLoading: (v: boolean) => void
}

export const useUiStore = create<UiState>(set => ({
	isLoading: false,
	setLoading: v => set({ isLoading: v }),
}))
