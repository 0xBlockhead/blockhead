// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
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
	bindings: [bindings[Source.TronFullNode_Rest]],
} satisfies SourceProviderDefinition
