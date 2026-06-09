import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import { rssFeedOrigins } from '$/sources/Rss/Rest/constants.ts'
import RssRestSource from '$/sources/Rss/Rest/index.ts'

export default {
	provider: SourceProvider.Rss,
	label: 'RSS / Atom',
	origins: rssFeedOrigins,
	sources: [
		RssRestSource,
	],
} satisfies SourceProviderDefinition
