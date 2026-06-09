export function DemoOtpBox() {
	return (
		<div
			className='rounded-[var(--radius-md)] border px-4 py-3 text-sm'
			style={{
				backgroundColor: 'var(--color-pending-light)',
				borderColor: 'var(--color-pending)',
				color: 'var(--color-text-primary)',
			}}
			role='status'
		>
			<span className='font-medium' style={{ color: 'var(--color-pending)' }}>
				Sinov tasdiqlash kodi:
			</span>{' '}
			<span className='font-mono text-base font-semibold tracking-widest'>
				111111
			</span>
		</div>
	)
}
