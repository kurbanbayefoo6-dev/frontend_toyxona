type StatusBadgeProps = {
	label: string
	bg: string
	color: string
}

export function StatusBadge({ label, bg, color }: StatusBadgeProps) {
	return (
		<span
			className='inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium'
			style={{ backgroundColor: bg, color }}
		>
			{label}
		</span>
	)
}
