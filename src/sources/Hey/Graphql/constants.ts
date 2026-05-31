import type { SourceOrigin } from '$/sources/$SourceProvider.ts'

export const heyApiOrigin = 'https://api.hey.xyz' as const

export const heyGraphqlPrimaryUrl = `${heyApiOrigin}/graphql` as const

export const heyGraphqlUrls = [
	heyGraphqlPrimaryUrl,
] as const

export const heyApiOrigins: readonly SourceOrigin[] = [
	{
		origin: heyApiOrigin,
		corsEnabled: false,
	},
]
