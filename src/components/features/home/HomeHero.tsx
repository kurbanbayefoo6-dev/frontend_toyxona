import type { ComponentProps } from 'react'

import { HERO_WEDDING_HALL_IMAGE } from '@/constants/hero'

import { HomeHeroSearch } from './HomeHeroSearch'
import { HomeHeroStats } from './HomeHeroStats'

type HomeHeroProps = {
	searchProps: ComponentProps<typeof HomeHeroSearch>
	statsProps: ComponentProps<typeof HomeHeroStats>
	onSearchSubmit?: () => void
}

export function HomeHero({
	searchProps,
	statsProps,
	onSearchSubmit,
}: HomeHeroProps) {
	return (
		<section
			className='relative flex min-h-[640px] w-full items-end justify-center overflow-hidden'
			aria-labelledby='home-hero-title'
		>
			<div
				className='absolute inset-0 bg-cover bg-center bg-no-repeat'
				style={{ backgroundImage: `url(${HERO_WEDDING_HALL_IMAGE})` }}
				role='img'
				aria-label='To‘y zali interyeri'
			/>
			<div className='absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/70' aria-hidden />
			<div className='absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[var(--color-page-bg)] to-transparent' aria-hidden />

			<div className='relative z-10 flex w-full flex-col items-center gap-8 px-4 pb-14 pt-28 text-center sm:gap-10 lg:pb-20'>
				<div className='mx-auto flex max-w-5xl flex-col items-center gap-5'>
					<span className='premium-badge border-white/30 bg-white/15 text-white backdrop-blur-md'>
						Toshkent bo‘ylab tanlangan to‘y To‘yxonalari
					</span>
					<h1
						id='home-hero-title'
						className='max-w-4xl text-4xl font-black leading-[1.02] sm:text-5xl lg:text-7xl'
						style={{ color: '#ffffff' }}
					>
						Butun kun oson o‘tadigan To‘yxonani toping
					</h1>
					<p
						className='mx-auto max-w-2xl text-base leading-relaxed sm:text-lg lg:text-xl'
						style={{ color: 'rgba(255, 255, 255, 0.92)' }}
					>
						Qidiring, solishtiring va premium zallarni shaffof narx, mavjudlik
						va xizmatlar bilan bir joyda band qiling.
					</p>
				</div>

				<HomeHeroSearch
					{...searchProps}
					onSearchSubmit={onSearchSubmit ?? searchProps.onSearchSubmit}
				/>

				<HomeHeroStats {...statsProps} />
			</div>
		</section>
	)
}
