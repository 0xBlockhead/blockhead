import { mastodonDefaultInstanceOrigin } from '$/constants/Mastodon.ts'

import type { SourceOrigin } from '$/sources/$SourceProvider.ts'

export const mastodonInstanceOrigin = mastodonDefaultInstanceOrigin

export const mastodonApiBase = `${mastodonInstanceOrigin}/api/v1` as const

export const mastodonOrigins: readonly SourceOrigin[] = [
	{
		origin: mastodonInstanceOrigin,
		corsEnabled: false,
	},
]
