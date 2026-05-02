import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { mastodonOrigins } from '$/sources/Mastodon/Rest/constants.ts'
import MastodonRestSource from '$/sources/Mastodon/Rest/index.ts'

export default {
	provider: SourceProvider.Mastodon,
	label: 'Mastodon',
	origins: mastodonOrigins,
	sources: [
		MastodonRestSource,
	],
} satisfies SourceProviderDefinition
