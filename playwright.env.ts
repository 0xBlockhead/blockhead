import type { BrowserContextOptions } from '@playwright/test'


export const playwrightHeadless = () => (
	process.env.PLAYWRIGHT_HEADLESS !== '0'
	&& process.env.PLAYWRIGHT_HEADLESS?.toLowerCase() !== 'false'
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
		v === 'reduce' ?
			'reduce'
		:
			'no-preference'
	)
}

export const e2eBrowserNewContextOptions = (): Pick<
	BrowserContextOptions,
	'colorScheme' | 'reducedMotion'
> => ({
	colorScheme: playwrightColorScheme(),
	reducedMotion: playwrightReducedMotion(),
})
