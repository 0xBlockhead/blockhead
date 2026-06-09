import { fediDefaultInstanceOrigin } from '$/constants/Fedi.ts'

import type { SourceOrigin } from '$/sources/SourceProvider.ts'

export const fediInstanceOrigin = fediDefaultInstanceOrigin

export const fediApiBase = `${fediInstanceOrigin}/api/v1` as const

export const fediOrigins: readonly SourceOrigin[] = [
	{
		origin: fediInstanceOrigin,
		corsEnabled: false,
	},
]
