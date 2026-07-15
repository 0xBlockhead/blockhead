export const redditOauthOrigin = 'https://oauth.reddit.com' as const

export const redditWwwOrigin = 'https://www.reddit.com' as const

export const redditOrigins = [
	{
		origin: redditOauthOrigin,
		corsEnabled: false,
	},
	{
		origin: redditWwwOrigin,
		corsEnabled: false,
	},
] as const

export const redditUserAgent = 'Blockhead/1.0.0 (+https://blockhead.vision) by /u/blockhead' as const
