// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/TronFullNode/bindings.ts'
import { type as arktype } from 'arktype'

export default {
	provider: SourceProvider.TronFullNode,
	label: 'TRON FullNode',
	env: arktype({
		'[string]': 'string',
	}),
	sources: [
		{
			source: Source.TronFullNode_Rest,
			label: 'TRON FullNode REST',
			env: arktype({
				'[string]': 'string',
			}),
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
