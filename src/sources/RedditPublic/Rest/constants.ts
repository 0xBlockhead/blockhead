export const redditPublicOrigin = 'https://www.reddit.com' as const

export const redditPublicOrigins = [
	{
		origin: redditPublicOrigin,
		corsEnabled: false,
	},
] as const

export const redditUserAgent = 'Blockhead/1.0.0 (+https://blockhead.vision) by /u/blockhead' as const
