import { type as arktype } from 'arktype'

import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { heyApiOrigins } from '$/sources/Hey/Graphql/constants.ts'
import HeyGraphqlSource from '$/sources/Hey/Graphql/index.ts'

export default {
	provider: SourceProvider.Hey,
	label: 'Hey',
	origins: heyApiOrigins,
	env: arktype({
		/** Optional `x-lens-app` for higher rate limits on the fallback Lens API. */
		PUBLIC_LENS_HEY_API_KEY: 'string > 0?',
	}),
	sources: [
		HeyGraphqlSource,
	],
} satisfies SourceProviderDefinition
