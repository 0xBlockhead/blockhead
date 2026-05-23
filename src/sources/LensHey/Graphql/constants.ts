import type { SourceOrigin } from '$/sources/$SourceProvider.ts'

export const lensHeyApiOrigin = 'https://api.hey.xyz' as const

export const lensHeyGraphqlPrimaryUrl = `${lensHeyApiOrigin}/graphql` as const

export const lensV2ApiOrigin = 'https://api-v2.lens.dev' as const

/** Redirects to `https://api.lens.xyz/graphql` when Hey is unavailable. */
export const lensHeyGraphqlFallbackUrl = `${lensV2ApiOrigin}/graphql` as const

export const lensHeyGraphqlUrls = [
	lensHeyGraphqlPrimaryUrl,
	lensHeyGraphqlFallbackUrl,
] as const

export const lensHeyApiOrigins: readonly SourceOrigin[] = [
	{
		origin: lensHeyApiOrigin,
		corsEnabled: false,
	},
	{
		origin: lensV2ApiOrigin,
		corsEnabled: false,
	},
]
