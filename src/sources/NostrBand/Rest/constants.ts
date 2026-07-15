export const nostrBandApiOrigin = 'https://api.nostr.band' as const

export const nostrBandApiBaseUrl = `${nostrBandApiOrigin}/v0` as const

export const nostrBandOrigins = [
	{
		origin: nostrBandApiOrigin,
		corsEnabled: false,
	},
] as const
