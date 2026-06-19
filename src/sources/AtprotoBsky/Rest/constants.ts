import { atprotoAppViewBySlug } from '$/constants/AtprotoAppView.ts'

import type { SourceOrigin } from '$/sources/SourceProvider.ts'

export const atprotoBskyOrigins: readonly SourceOrigin[] = [
	{
		origin: atprotoAppViewBySlug.bsky_public.origin,
		corsEnabled: false,
	},
]
