import type { SourceOrigin } from '$/sources/$SourceProvider.ts'

export const lensHeyApiOrigin = 'https://api.hey.xyz' as const

export const lensHeyGraphqlPrimaryUrl = `${lensHeyApiOrigin}/graphql` as const

export const lensHeyGraphqlUrls = [
	lensHeyGraphqlPrimaryUrl,
] as const

export const lensHeyApiOrigins: readonly SourceOrigin[] = [
	{
		origin: lensHeyApiOrigin,
		corsEnabled: false,
	},
]
