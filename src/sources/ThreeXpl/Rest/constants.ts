export const sandboxOrigin = 'https://sandbox-api.3xpl.com' as const
export const productionOrigin = 'https://api.3xpl.com' as const

export const sandboxBaseUrl = `${sandboxOrigin}/` as const
export const productionBaseUrl = `${productionOrigin}/` as const

export const threeXplOrigins = [
	{
		origin: sandboxOrigin,
		corsEnabled: true,
	},
	{
		origin: productionOrigin,
		corsEnabled: true,
	},
] as const
