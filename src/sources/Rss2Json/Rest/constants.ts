import type { SourceOrigin } from '$/sources/SourceProvider.ts'

export const rss2JsonOrigin = 'https://api.rss2json.com' as const

export const rss2JsonApiOrigins: readonly SourceOrigin[] = [
	{
		origin: rss2JsonOrigin,
		corsEnabled: false,
	},
]
