import { useEffect, useState } from 'react'

import { useAuthStore } from '@/stores/authStore'

export function useAuthHydrated(): boolean {
	const [hydrated, setHydrated] = useState(
		() => useAuthStore.persist.hasHydrated(),
	)

	useEffect(() => {
		const unsub = useAuthStore.persist.onFinishHydration(() => {
			setHydrated(true)
		})
		if (useAuthStore.persist.hasHydrated()) {
			setHydrated(true)
		}
		return unsub
	}, [])

	return hydrated
}
