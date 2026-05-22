import type { SourceOrigin } from '$/sources/$SourceProvider.ts'

export const redditPublicOrigin = 'https://www.reddit.com' as const

export const redditPublicApiOrigins: readonly SourceOrigin[] = [
	{
		origin: redditPublicOrigin,
		corsEnabled: false,
	},
]

export const redditUserAgent = 'Blockhead/0.0.0' as const
