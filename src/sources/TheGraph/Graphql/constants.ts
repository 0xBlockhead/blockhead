export const gatewayOrigin = 'https://gateway.thegraph.com' as const

export const theGraphOrigins = [
	{
		origin: gatewayOrigin,
		corsEnabled: false,
	},
] as const
