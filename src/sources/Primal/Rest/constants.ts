export const primalApiOrigin = 'https://api.primal.net' as const

export const primalApiBaseUrl = `${primalApiOrigin}/v1` as const

export const primalOrigins = [
	{
		origin: primalApiOrigin,
		corsEnabled: false,
	},
] as const
