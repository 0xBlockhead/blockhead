import { type as arktype } from 'arktype'

import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { pipedApiOrigins } from '$/sources/Piped/Rest/constants.ts'
import PipedRestSource from '$/sources/Piped/Rest/index.ts'

export default {
	provider: SourceProvider.Piped,
	label: 'Piped',
	origins: pipedApiOrigins,
	env: arktype({
		PUBLIC_PIPED_API_BASE_URL: 'string > 0?',
	}),
	sources: [
		PipedRestSource,
	],
} satisfies SourceProviderDefinition
