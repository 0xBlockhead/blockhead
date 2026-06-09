import type { SourceOrigin } from '$/sources/SourceProvider.ts'

export const youtubeApiOrigin = 'https://www.googleapis.com' as const

export const youtubeApiV3Base = `${youtubeApiOrigin}/youtube/v3` as const

export const youtubeApiOrigins: readonly SourceOrigin[] = [
	{
		origin: youtubeApiOrigin,
		corsEnabled: false,
	},
]
