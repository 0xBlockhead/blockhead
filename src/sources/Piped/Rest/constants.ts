import type { SourceOrigin } from '$/sources/SourceProvider.ts'

export const pipedApiDefaultOrigin = 'https://pipedapi.kavin.rocks' as const

export const pipedApiOrigins: readonly SourceOrigin[] = [
	{
		origin: pipedApiDefaultOrigin,
		corsEnabled: false,
	},
]
