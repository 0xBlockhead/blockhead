// Generated from APP.ts.

import bindings from '$/sources/BitcoinCashNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.BitcoinCashNode,
	label: 'Bitcoin Cash Node',
	sources: [
		{
			source: Source.BitcoinCashNode_JsonRpc,
			label: 'Bitcoin Cash Node JSON-RPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
