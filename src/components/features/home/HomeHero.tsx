import type { ComponentProps } from 'react'

import { HERO_OVERLAY, HERO_WEDDING_HALL_IMAGE } from '@/constants/hero'

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
			className='relative flex min-h-[320px] w-full items-center justify-center overflow-hidden lg:min-h-[520px]'
			aria-labelledby='home-hero-title'
		>
			<div
				className='absolute inset-0 bg-cover bg-center bg-no-repeat'
				style={{ backgroundImage: `url(${HERO_WEDDING_HALL_IMAGE})` }}
				role='img'
				aria-label='To‘yxona zali fon rasmi'
			/>
			<div
				className='absolute inset-0'
				style={{ backgroundColor: HERO_OVERLAY }}
				aria-hidden
			/>

			<div className='relative z-10 flex w-full flex-col items-center gap-8 px-4 py-12 text-center sm:gap-10 sm:py-16 lg:gap-12 lg:py-20'>
				<div className='mx-auto flex max-w-3xl flex-col gap-4'>
					<h1
						id='home-hero-title'
						className='text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl'
						style={{ color: '#ffffff' }}
					>
						Orzuingizdagi to‘yxona bir necha daqiqada
					</h1>
					<p
						className='mx-auto max-w-2xl text-sm leading-relaxed sm:text-base lg:text-lg'
						style={{ color: 'rgba(255, 255, 255, 0.92)' }}
					>
						Toshkentdagi eng yaxshi to‘yxonalarni qidiring, solishtiring va bron
						qiling.
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
