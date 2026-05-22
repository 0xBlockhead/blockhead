import { type as arktype } from 'arktype'

import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { youtubeApiOrigins } from '$/sources/Youtube/Rest/constants.ts'
import YoutubeRestSource from '$/sources/Youtube/Rest/index.ts'

export default {
	provider: SourceProvider.Youtube,
	label: 'YouTube',
	origins: youtubeApiOrigins,
	env: arktype({
		PUBLIC_YOUTUBE_API_KEY: 'string > 0',
	}),
	sources: [
		YoutubeRestSource,
	],
} satisfies SourceProviderDefinition
