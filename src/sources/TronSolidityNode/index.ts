// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/TronSolidityNode/bindings.ts'

export default {
	provider: SourceProvider.TronSolidityNode,
	label: 'TRON SolidityNode',
	sources: [
		{
			source: Source.TronSolidityNode_Rest,
			label: 'TRON SolidityNode REST',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
