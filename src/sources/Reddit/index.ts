// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Reddit/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import { type as arktype } from 'arktype'

export default {
	provider: SourceProvider.Reddit,
	label: 'Reddit',
	env: arktype({
		'PUBLIC_REDDIT_CLIENT_ID': 'string > 0',
		'PUBLIC_REDDIT_CLIENT_SECRET': 'string > 0',
	}),
	sources: [
		{
			source: Source.Reddit_Rest,
			label: 'Reddit OAuth REST',
			env: arktype({
				'PUBLIC_REDDIT_CLIENT_ID': 'string > 0',
				'PUBLIC_REDDIT_CLIENT_SECRET': 'string > 0',
			}),
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
