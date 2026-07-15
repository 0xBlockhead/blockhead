export const youtubeApiOrigin = 'https://www.googleapis.com' as const

export const youtubeApiV3Base = `${youtubeApiOrigin}/youtube/v3` as const

export const youtubeOrigins = [
	{
		origin: youtubeApiOrigin,
		corsEnabled: false,
	},
] as const
