/**
 * Sourcify API — host vs path split (CORS / provider `origins` vs request base URLs).
 * @see https://sourcify.dev/server/v2/contract/1/0x00000000219ab540356cBB839Cbe05303d7705Fa
 */

export const origin = 'https://sourcify.dev' as const

export const serverPathPrefix = '/server/v2' as const

export const baseUrl = `${origin}${serverPathPrefix}` as const

export const sourcifyOrigins = [
	{
		origin,
		corsEnabled: false,
	},
] as const
