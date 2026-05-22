import type { SourceOrigin } from '$/sources/$SourceProvider.ts'

export const nostrBandApiOrigin = 'https://api.nostr.band' as const

export const nostrBandApiBaseUrl = `${nostrBandApiOrigin}/v0` as const

export const nostrBandApiOrigins: readonly SourceOrigin[] = [
	{
		origin: nostrBandApiOrigin,
		corsEnabled: false,
	},
]
