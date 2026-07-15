export const bskySocialOrigin = 'https://bsky.social' as const

export const bskySocialOrigins = [
	{
		origin: bskySocialOrigin,
		corsEnabled: false,
	},
] as const

export const bskySocialXrpcBase = `${bskySocialOrigin}/xrpc` as const
