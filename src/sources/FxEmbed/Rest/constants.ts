import type { SourceOrigin } from '$/sources/$SourceProvider.ts'

export const fxEmbedApiOrigin = 'https://api.fxtwitter.com' as const

export const fxEmbedApiV2Base = `${fxEmbedApiOrigin}/2` as const

export const fxEmbedApiOrigins: readonly SourceOrigin[] = [
	{
		origin: fxEmbedApiOrigin,
		corsEnabled: true,
	},
]
