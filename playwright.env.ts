import type { BrowserContextOptions } from '@playwright/test'


export const playwrightHeadless = () => (
	process.env.PLAYWRIGHT_HEADLESS === '1'
	|| process.env.PLAYWRIGHT_HEADLESS?.toLowerCase() === 'true'
)

export const playwrightColorScheme = (): NonNullable<BrowserContextOptions['colorScheme']> => {
	const v = process.env.PLAYWRIGHT_COLOR_SCHEME?.toLowerCase()
	return (
		v === 'light' ?
			'light'
		: v === 'no-preference' ?
			'no-preference'
		:
			'dark'
	)
}

export const playwrightReducedMotion = (): NonNullable<BrowserContextOptions['reducedMotion']> => {
	const v = process.env.PLAYWRIGHT_REDUCED_MOTION?.toLowerCase()
	return (
		v === 'no-preference' ?
			'no-preference'
		:
			'reduce'
	)
}

export const e2eBrowserNewContextOptions = (): Pick<
	BrowserContextOptions,
	'colorScheme' | 'reducedMotion'
> => ({
	colorScheme: playwrightColorScheme(),
	reducedMotion: playwrightReducedMotion(),
})
