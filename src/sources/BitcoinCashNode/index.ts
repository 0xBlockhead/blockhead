// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/BitcoinCashNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.BitcoinCashNode,
	label: 'Bitcoin Cash Node',
	sources: [
		{
			source: Source.BitcoinCashNode_JsonRpc,
			label: 'Bitcoin Cash Node JSON-RPC',
		},
	],
	bindings: [bindings[Source.BitcoinCashNode_JsonRpc]],
} satisfies SourceProviderDefinition
