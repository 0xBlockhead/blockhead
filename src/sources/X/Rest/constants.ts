import type { SourceOrigin } from '$/sources/$SourceProvider.ts'

/** X API v2. */
export const xApiOrigin = 'https://api.x.com' as const

export const xApiV2Base = `${xApiOrigin}/2` as const

export const xApiOrigins: readonly SourceOrigin[] = [
	{
		origin: xApiOrigin,
		corsEnabled: false,
	},
]
