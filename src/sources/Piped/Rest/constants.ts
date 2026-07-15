export const pipedApiDefaultOrigin = 'https://api.piped.private.coffee' as const

export const pipedApiOrigins = [
	{
		origin: pipedApiDefaultOrigin,
		corsEnabled: true,
	},
] as const
