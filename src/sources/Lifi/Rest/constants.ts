/**
 * Production LI.FI API — host only (OpenAPI paths appended by client).
 * @see https://docs.li.fi/openapi.yaml
 */
export const origin = 'https://li.quest' as const

export const baseUrl = origin

/**
 * Staging host — pass as `baseUrl` to {@link fetchLifiChains} / {@link fetchLifiTokens}.
 * @see https://docs.li.fi/openapi.yaml
 */
export const stagingOrigin = 'https://staging.li.quest' as const

export const stagingBaseUrl = stagingOrigin

export const lifiRestOrigins = [
	{
		origin,
		corsEnabled: false,
	},
	{
		origin: stagingOrigin,
		corsEnabled: false,
	},
] as const
