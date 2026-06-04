import { APP_NAME } from '@/constants'

const FRONTEND_VERSION = '0.0.0'

export default function AdminSettingsPage() {
	const modeLabel = import.meta.env.PROD ? 'Ishga tushirish' : 'Ishlab chiqish'
	const apiConfigured = Boolean(import.meta.env.VITE_API_URL)

	return (
		<div className='mx-auto max-w-lg'>
			<h1
				className='mb-6 text-2xl font-semibold'
				style={{ color: 'var(--color-text-primary)' }}
			>
				Sozlamalar
			</h1>

			<section
				className='mb-6 rounded-[var(--radius-lg)] border p-4 sm:p-6'
				style={{
					backgroundColor: 'var(--color-card-bg)',
					borderColor: 'var(--color-border)',
				}}
			>
				<h2
					className='mb-4 text-lg font-semibold'
					style={{ color: 'var(--color-text-primary)' }}
				>
					Tizim ma’lumotlari
				</h2>
				<dl className='space-y-3 text-sm'>
					<SettingsRow label='Loyiha' value={APP_NAME} />
					<SettingsRow label='Interfeys versiyasi' value={FRONTEND_VERSION} />
					<SettingsRow label='Muhit' value={modeLabel} />
				</dl>
			</section>

			<section
				className='rounded-[var(--radius-lg)] border p-4 sm:p-6'
				style={{
					backgroundColor: 'var(--color-card-bg)',
					borderColor: 'var(--color-border)',
				}}
			>
				<h2
					className='mb-4 text-lg font-semibold'
					style={{ color: 'var(--color-text-primary)' }}
				>
					Muhit sozlamalari
				</h2>
				<dl className='space-y-3 text-sm'>
					<SettingsRow
						label='API ulanishi'
						value={apiConfigured ? 'Sozlangan' : 'Sozlanmagan'}
					/>
					<SettingsRow
						label='Yig‘ish rejimi'
						value={import.meta.env.PROD ? 'Ishga tushirish' : 'Ishlab chiqish'}
					/>
				</dl>
				<p
					className='mt-4 text-xs'
					style={{ color: 'var(--color-text-hint)' }}
				>
					Xavfsizlik uchun maxfiy kalitlar va tokenlar bu yerda ko‘rsatilmaydi.
				</p>
			</section>
		</div>
	)
}

function SettingsRow({ label, value }: { label: string; value: string }) {
	return (
		<div className='flex justify-between gap-4'>
			<dt style={{ color: 'var(--color-text-hint)' }}>{label}</dt>
			<dd className='text-right font-medium'>{value}</dd>
		</div>
	)
}
