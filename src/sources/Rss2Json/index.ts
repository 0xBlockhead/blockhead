import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import { rss2JsonApiOrigins } from '$/sources/Rss2Json/Rest/constants.ts'
import Rss2JsonRestSource from '$/sources/Rss2Json/Rest/index.ts'

export default {
	provider: SourceProvider.Rss2Json,
	label: 'RSS2JSON',
	origins: rss2JsonApiOrigins,
	sources: [
		Rss2JsonRestSource,
	],
} satisfies SourceProviderDefinition
