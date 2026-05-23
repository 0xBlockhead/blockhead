import type { SourceOrigin } from '$/sources/$SourceProvider.ts'

/** X API v2 (legacy host name in DNS). */
export const xApiOrigin = 'https://api.twitter.com' as const

export const xApiV2Base = `${xApiOrigin}/2` as const

export const xApiOrigins: readonly SourceOrigin[] = [
	{
		origin: xApiOrigin,
		corsEnabled: false,
	},
]
