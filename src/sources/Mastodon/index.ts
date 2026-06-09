import { type as arktype } from 'arktype'

import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import { mastodonOrigins } from '$/sources/Mastodon/Rest/constants.ts'
import MastodonRestSource from '$/sources/Mastodon/Rest/index.ts'

export default {
	provider: SourceProvider.Mastodon,
	label: 'Mastodon',
	env: arktype({
		PUBLIC_MASTODON_ACCESS_TOKEN: 'string > 0?',
	}),
	origins: mastodonOrigins,
	sources: [
		MastodonRestSource,
	],
} satisfies SourceProviderDefinition
