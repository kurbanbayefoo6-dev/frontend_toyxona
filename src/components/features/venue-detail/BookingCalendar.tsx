import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

import type {
	BookingCalendarEntry,
	CalendarDayStatus,
	VenueAvailability,
} from '@/types/venueDetail'
import {
	addMonths,
	getCalendarDays,
	getDayStatus,
	isSameMonth,
	startOfMonth,
	toDateKey,
} from '@/utils/calendar'

const WEEKDAYS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']

type BookingCalendarProps = {
	availability: VenueAvailability
	selectedDate: string | null
	onSelectDate: (date: string) => void
	onBookedDateClick?: (date: string) => void
	canViewBookingDetails?: boolean
	bookedDetailsByDate?: Map<string, BookingCalendarEntry>
}

const statusStyles: Record<
	CalendarDayStatus,
	{ bg: string; color: string; border: string }
> = {
	available: {
		bg: 'var(--color-available-light)',
		color: 'var(--color-available)',
		border: 'var(--color-available)',
	},
	booked: {
		bg: 'var(--color-booked-light)',
		color: 'var(--color-booked)',
		border: 'var(--color-booked)',
	},
	past: {
		bg: 'var(--color-surface-secondary)',
		color: 'var(--color-text-hint)',
		border: 'var(--color-border)',
	},
}

export function BookingCalendar({
	availability,
	selectedDate,
	onSelectDate,
	onBookedDateClick,
	canViewBookingDetails = false,
	bookedDetailsByDate,
}: BookingCalendarProps) {
	const [currentMonth, setCurrentMonth] = useState(() =>
		startOfMonth(new Date()),
	)
	const days = getCalendarDays(currentMonth)

	return (
		<div>
			<div className='mb-3 flex items-center justify-between'>
				<button
					type='button'
					onClick={() => setCurrentMonth(m => addMonths(m, -1))}
					className='rounded-[var(--radius-sm)] p-1'
					style={{ color: 'var(--color-text-secondary)' }}
					aria-label='Oldingi oy'
				>
					<ChevronLeft className='size-5' />
				</button>
				<span
					className='text-sm font-semibold capitalize'
					style={{ color: 'var(--color-text-primary)' }}
				>
					{format(currentMonth, 'LLLL yyyy', { locale: uz })}
				</span>
				<button
					type='button'
					onClick={() => setCurrentMonth(m => addMonths(m, 1))}
					className='rounded-[var(--radius-sm)] p-1'
					style={{ color: 'var(--color-text-secondary)' }}
					aria-label='Keyingi oy'
				>
					<ChevronRight className='size-5' />
				</button>
			</div>

			<CalendarLegend />

			<div className='mt-3 grid grid-cols-7 gap-1'>
				{WEEKDAYS.map(d => (
					<div
						key={d}
						className='py-1 text-center text-xs font-medium'
						style={{ color: 'var(--color-text-hint)' }}
					>
						{d}
					</div>
				))}
				{days.map(day => {
					const status = getDayStatus(day, availability)
					const key = toDateKey(day)
					const inMonth = isSameMonth(day, currentMonth)
					const isSelected = selectedDate === key
					const styles = statusStyles[status]
					const isPast = status === 'past'
					const isBooked = status === 'booked'
					const isAvailable = status === 'available'
					const bookingDetails = bookedDetailsByDate?.get(key)

					const handleClick = () => {
						if (isBooked && canViewBookingDetails && onBookedDateClick) {
							onBookedDateClick(key)
							return
						}
						if (isAvailable) {
							onSelectDate(key)
						}
					}

					const clickable =
						(isAvailable || (isBooked && canViewBookingDetails)) && inMonth

					return (
						<div key={key + day.toISOString()} className='group relative'>
							<button
								type='button'
								disabled={!clickable}
								onClick={handleClick}
								className={[
									'aspect-square w-full rounded-[var(--radius-sm)] text-xs font-medium transition-opacity',
									!inMonth ? 'opacity-30' : '',
									!clickable
										? 'cursor-not-allowed'
										: 'cursor-pointer hover:opacity-80',
									isSelected ? 'ring-2 ring-offset-1' : '',
								].join(' ')}
								style={{
									backgroundColor: styles.bg,
									color: styles.color,
									borderWidth: 1,
									borderStyle: 'solid',
									borderColor: isSelected
										? 'var(--color-brand)'
										: styles.border,
									...(isSelected
										? { outlineColor: 'var(--color-brand)' }
										: {}),
								}}
								aria-label={`${format(day, 'd MMMM', { locale: uz })} - ${
									isPast ? 'otgan' : isBooked ? 'band' : 'bosh'
								}`}
							>
								{format(day, 'd')}
							</button>
							{isBooked && canViewBookingDetails && bookingDetails ? (
								<div
									className='pointer-events-none absolute left-1/2 bottom-full z-20 mb-2 w-48 -translate-x-1/2 rounded-[var(--radius-md)] px-3 py-2 text-left text-xs opacity-0 shadow-lg transition-opacity group-hover:opacity-100'
									style={{
										backgroundColor: 'var(--color-card-bg)',
										color: 'var(--color-text-primary)',
										border: '1px solid var(--color-border)',
									}}
								>
									<p className='truncate font-semibold'>
										{bookingDetails.customerName}
									</p>
									<p style={{ color: 'var(--color-text-secondary)' }}>
										{bookingDetails.customerPhone}
									</p>
									<p style={{ color: 'var(--color-text-secondary)' }}>
										{bookingDetails.guestCount} kishi
									</p>
								</div>
							) : null}
						</div>
					)
				})}
			</div>
		</div>
	)
}

function CalendarLegend() {
	const items = [
		{ label: 'Bosh', color: 'var(--color-available)' },
		{ label: 'Band', color: 'var(--color-booked)' },
		{ label: 'Otgan', color: 'var(--color-text-hint)' },
	] as const

	return (
		<div className='flex flex-wrap gap-3'>
			{items.map(item => (
				<span
					key={item.label}
					className='inline-flex items-center gap-1.5 text-xs'
					style={{ color: 'var(--color-text-secondary)' }}
				>
					<span
						className='size-3 rounded-full'
						style={{ backgroundColor: item.color }}
					/>
					{item.label}
				</span>
			))}
		</div>
	)
}
