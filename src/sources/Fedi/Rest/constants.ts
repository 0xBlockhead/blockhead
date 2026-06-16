import { fediInstanceBySlug } from '$/constants/Fedi.ts'

import type { SourceOrigin } from '$/sources/SourceProvider.ts'

export const fediOrigins: readonly SourceOrigin[] = [
	{
		origin: fediInstanceBySlug.fosstodon.origin,
		corsEnabled: false,
	},
]
