import { create } from 'zustand'

export type District =
	| 'Bektemir'
	| 'Chilonzor'
	| 'Mirobod'
	| 'Mirzo Ulug‘bek'
	| 'Olmazor'
	| 'Sergeli'
	| 'Shayxontohur'
	| 'Uchtepa'
	| 'Yakkasaroy'
	| 'Yashnobod'
	| 'Yunusobod'
	| 'Yangihayot'

type DistrictState = {
	district: District | null
	setDistrict: (d: District | null) => void
	clearDistrict: () => void
}

export const useDistrictStore = create<DistrictState>(set => ({
	district: null,
	setDistrict: d => set({ district: d }),
	clearDistrict: () => set({ district: null }),
}))
