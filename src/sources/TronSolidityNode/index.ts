// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/TronSolidityNode/bindings.ts'
import { type as arktype } from 'arktype'

export default {
	provider: SourceProvider.TronSolidityNode,
	label: 'TRON SolidityNode',
	env: arktype({
		'[string]': 'string',
	}),
	sources: [
		{
			source: Source.TronSolidityNode_Rest,
			label: 'TRON SolidityNode REST',
			env: arktype({
				'[string]': 'string',
			}),
		},
	],
	bindings: [bindings[Source.TronSolidityNode_Rest]],
} satisfies SourceProviderDefinition
