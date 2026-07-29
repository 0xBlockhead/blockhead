// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/X/bindings.ts'
import { type as arktype } from 'arktype'

export default {
	provider: SourceProvider.X,
	label: 'X',
	env: arktype({
		'PUBLIC_X_API_BEARER': 'string > 0',
	}),
	sources: [
		{
			source: Source.X_Rest,
			label: 'X API v2',
			env: arktype({
				'PUBLIC_X_API_BEARER': 'string > 0',
			}),
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
