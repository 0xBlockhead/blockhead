import type { SourceOrigin } from '$/sources/SourceProvider.ts'

export const lensApiOrigin = 'https://api.lens.xyz' as const

export const lensHeyApiOrigin = 'https://api.hey.xyz' as const

export const lensGraphqlUrl = `${lensApiOrigin}/graphql` as const

export const lensHeyGraphqlUrl = `${lensHeyApiOrigin}/graphql` as const

export const lensApiOrigins: readonly SourceOrigin[] = [
	{
		origin: lensApiOrigin,
		corsEnabled: false,
	},
	{
		origin: lensHeyApiOrigin,
		corsEnabled: false,
	},
]
