import { type as arktype } from 'arktype'

import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import { redditApiOrigins } from '$/sources/Reddit/Rest/constants.ts'
import RedditOauthSource from '$/sources/Reddit/Rest/index.ts'

export default {
	provider: SourceProvider.Reddit,
	label: 'Reddit',
	origins: redditApiOrigins,
	env: arktype({
		PUBLIC_REDDIT_CLIENT_ID: 'string > 0',
		PUBLIC_REDDIT_CLIENT_SECRET: 'string > 0',
	}),
	sources: [
		RedditOauthSource,
	],
} satisfies SourceProviderDefinition
