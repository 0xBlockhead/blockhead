import { mastodonInstanceByKey } from '$/constants/Mastodon.ts'

import type { SourceOrigin } from '$/sources/SourceProvider.ts'

export const mastodonOrigins: readonly SourceOrigin[] = [
	{
		origin: mastodonInstanceByKey.mastodon_social.origin,
		corsEnabled: false,
	},
]
