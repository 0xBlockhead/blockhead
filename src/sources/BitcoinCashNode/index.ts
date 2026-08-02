// Generated from APP.ts.

import bindings from '$/sources/BitcoinCashNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.BitcoinCashNode,
	label: 'Bitcoin Cash Node',
	sources: {
		[Source.BitcoinCashNode_JsonRpc]: {
			label: 'Bitcoin Cash Node JSON-RPC',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
