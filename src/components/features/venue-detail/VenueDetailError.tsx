import { VenueListError } from '@/components/features/venues/VenueListError'

type VenueDetailErrorProps = {
	message: string
	onRetry: () => void
	isRetrying?: boolean
}

export function VenueDetailError({
	message,
	onRetry,
	isRetrying,
}: VenueDetailErrorProps) {
	return <VenueListError message={message} onRetry={onRetry} isRetrying={isRetrying} />
}
