import { Alert, Button } from '@/components/ui'

type VenueListErrorProps = {
	message: string
	onRetry: () => void
	isRetrying?: boolean
}

export function VenueListError({
	message,
	onRetry,
	isRetrying = false,
}: VenueListErrorProps) {
	return (
		<div
			className='flex flex-col items-center gap-4 rounded-[var(--radius-lg)] border px-6 py-12 text-center'
			style={{
				backgroundColor: 'var(--color-card-bg)',
				borderColor: 'var(--color-border)',
			}}
		>
			<Alert variant='error'>{message}</Alert>
			<Button
				type='button'
				variant='secondary'
				className='!w-auto px-6'
				loading={isRetrying}
				disabled={isRetrying}
				onClick={onRetry}
			>
				Qayta urinish
			</Button>
		</div>
	)
}
