// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/TronFullNode/bindings.ts'

export default {
	provider: SourceProvider.TronFullNode,
	label: 'TRON FullNode',
	sources: {
		[Source.TronFullNode_Rest]: {
			label: 'TRON FullNode REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
