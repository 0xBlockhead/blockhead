import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { redditPublicApiOrigins } from '$/sources/RedditPublic/Rest/constants.ts'
import RedditPublicJsonSource from '$/sources/RedditPublic/Rest/index.ts'

export default {
	provider: SourceProvider.RedditPublic,
	label: 'Reddit public JSON',
	origins: redditPublicApiOrigins,
	sources: [
		RedditPublicJsonSource,
	],
} satisfies SourceProviderDefinition
