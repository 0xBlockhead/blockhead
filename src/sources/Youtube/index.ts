// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/Youtube/bindings.ts'
import { type as arktype } from 'arktype'

export default {
	provider: SourceProvider.Youtube,
	label: 'YouTube',
	env: arktype({
		'PUBLIC_YOUTUBE_API_KEY': 'string > 0',
	}),
	sources: [
		{
			source: Source.Youtube_Rest,
			label: 'YouTube Data API v3',
			env: arktype({
				'PUBLIC_YOUTUBE_API_KEY': 'string > 0',
			}),
		},
	],
	bindings: [bindings[Source.Youtube_Rest]],
} satisfies SourceProviderDefinition
