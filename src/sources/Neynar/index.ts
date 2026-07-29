// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Neynar/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import { type as arktype } from 'arktype'

export default {
	provider: SourceProvider.Neynar,
	label: 'Neynar',
	env: arktype({
		'PUBLIC_NEYNAR_API_KEY': 'string > 0?',
	}),
	sources: [
		{
			source: Source.Neynar_Rest,
			label: 'Neynar REST',
			env: arktype({
				'PUBLIC_NEYNAR_API_KEY': 'string > 0?',
			}),
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
