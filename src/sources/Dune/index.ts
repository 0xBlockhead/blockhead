// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Dune/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import { type as arktype } from 'arktype'

export default {
	provider: SourceProvider.Dune,
	label: 'Dune',
	env: arktype({
		'PUBLIC_DUNE_API_KEY': 'string > 0',
	}),
	sources: [
		{
			source: Source.Dune_Rest,
			label: 'Dune REST',
			env: arktype({
				'PUBLIC_DUNE_API_KEY': 'string > 0',
			}),
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
