import { type as arktype } from 'arktype'

import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import { lensApiOrigins } from '$/sources/Lens/Graphql/constants.ts'
import LensGraphqlSource from '$/sources/Lens/Graphql/index.ts'

export default {
	provider: SourceProvider.Lens,
	label: 'Lens Protocol',
	origins: lensApiOrigins,
	env: arktype({
		/** Server API key; optional for public reads, increases rate limits (never expose in untrusted client builds). */
		PUBLIC_LENS_API_KEY: 'string > 0?',
	}),
	sources: [
		LensGraphqlSource,
	],
} satisfies SourceProviderDefinition
