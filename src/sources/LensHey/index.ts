import { type as arktype } from 'arktype'

import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { lensHeyApiOrigins } from '$/sources/LensHey/Graphql/constants.ts'
import LensHeyGraphqlSource from '$/sources/LensHey/Graphql/index.ts'

export default {
	provider: SourceProvider.LensHey,
	label: 'Hey',
	origins: lensHeyApiOrigins,
	env: arktype({
		/** Optional `x-lens-app` for higher rate limits on the fallback Lens API. */
		PUBLIC_LENS_HEY_API_KEY: 'string > 0?',
	}),
	sources: [
		LensHeyGraphqlSource,
	],
} satisfies SourceProviderDefinition
