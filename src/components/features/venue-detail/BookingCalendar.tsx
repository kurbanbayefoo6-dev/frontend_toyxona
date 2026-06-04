import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { uz } from 'date-fns/locale'
import { useState } from 'react'

import type { CalendarDayStatus, VenueAvailability } from '@/types/venueDetail'
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
						<button
							key={key + day.toISOString()}
							type='button'
							disabled={!clickable}
							onClick={handleClick}
							className={[
								'aspect-square rounded-[var(--radius-sm)] text-xs font-medium transition-opacity',
								!inMonth ? 'opacity-30' : '',
								!clickable ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-80',
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
							aria-label={`${format(day, 'd MMMM', { locale: uz })}${
								isPast ? ' — o‘tgan' : isBooked ? ' — band' : ' — bo‘sh'
							}`}
						>
							{format(day, 'd')}
						</button>
					)
				})}
			</div>
		</div>
	)
}

function CalendarLegend() {
	const items = [
		{ label: 'Bo‘sh', color: 'var(--color-available)' },
		{ label: 'Band', color: 'var(--color-booked)' },
		{ label: 'O‘tgan', color: 'var(--color-text-hint)' },
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
