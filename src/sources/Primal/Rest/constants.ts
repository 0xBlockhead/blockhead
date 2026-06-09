import type { SourceOrigin } from '$/sources/SourceProvider.ts'

export const primalApiOrigin = 'https://api.primal.net' as const

export const primalApiBaseUrl = `${primalApiOrigin}/v1` as const

export const primalApiOrigins: readonly SourceOrigin[] = [
	{
		origin: primalApiOrigin,
		corsEnabled: false,
	},
]
