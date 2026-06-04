import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Heart } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useFavoriteIds } from '@/hooks/useFavoriteIds'
import {
	addFavorite,
	removeFavorite,
} from '@/services/favorite.service'
import { toast } from '@/stores/toastStore'
import { useAuthStore } from '@/stores/authStore'
import { getApiErrorMessage } from '@/utils/authErrors'
import {
	isSafeRedirectPath,
	setAuthRedirect,
} from '@/utils/bookingRedirect'

type FavoriteButtonProps = {
	venueId: number
	className?: string
}

export function FavoriteButton({ venueId, className = '' }: FavoriteButtonProps) {
	const navigate = useNavigate()
	const location = useLocation()
	const queryClient = useQueryClient()
	const isAuthenticated = useAuthStore(s => s.isAuthenticated)
	const role = useAuthStore(s => s.role)

	const { data: favoriteIds, isLoading: idsLoading } = useFavoriteIds()
	const isFavorite = favoriteIds?.has(venueId) ?? false

	const toggleMutation = useMutation({
		mutationFn: async () => {
			if (isFavorite) {
				await removeFavorite(venueId)
				return false
			}
			await addFavorite(venueId)
			return true
		},
		onSuccess: added => {
			void queryClient.invalidateQueries({ queryKey: ['customer', 'favorite-ids'] })
			void queryClient.invalidateQueries({ queryKey: ['customer', 'favorites'] })
			toast.success(
				added
					? 'Sevimlilarga qo‘shildi'
					: 'Sevimlilardan olib tashlandi',
			)
		},
		onError: err => {
			toast.error(getApiErrorMessage(err, 'Server bilan bog‘lanib bo‘lmadi'))
		},
	})

	if (isAuthenticated && role !== 'customer') {
		return null
	}

	const returnPath = `${location.pathname}${location.search}`

	function handleClick(e: React.MouseEvent) {
		e.preventDefault()
		e.stopPropagation()

		if (!isAuthenticated) {
			if (isSafeRedirectPath(returnPath)) {
				setAuthRedirect(returnPath)
			}
			const redirect = isSafeRedirectPath(returnPath)
				? `?redirect=${encodeURIComponent(returnPath)}`
				: ''
			navigate(`/login${redirect}`)
			return
		}

		if (toggleMutation.isPending || idsLoading) return
		toggleMutation.mutate()
	}

	const label = isFavorite
		? 'Sevimlilardan olib tashlash'
		: 'Sevimlilarga qo‘shish'

	return (
		<button
			type='button'
			className={`inline-flex cursor-pointer items-center justify-center rounded-full border-0 bg-white/90 p-2 shadow-sm transition-colors hover:bg-white disabled:opacity-60 ${className}`}
			onClick={handleClick}
			disabled={toggleMutation.isPending || (isAuthenticated && idsLoading)}
			aria-label={label}
			aria-pressed={isFavorite}
		>
			<Heart
				className='size-5'
				style={{
					color: isFavorite ? 'var(--color-booked)' : 'var(--color-text-secondary)',
				}}
				fill={isFavorite ? 'var(--color-booked)' : 'none'}
				aria-hidden
			/>
		</button>
	)
}
