export const fxEmbedApiOrigin = 'https://api.fxtwitter.com' as const

export const fxEmbedApiV2Base = `${fxEmbedApiOrigin}/2` as const

export const fxEmbedOrigins = [
	{
		origin: fxEmbedApiOrigin,
		corsEnabled: false,
	},
] as const
