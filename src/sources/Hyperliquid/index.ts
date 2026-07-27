// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Hyperliquid/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Hyperliquid,
	label: 'Hyperliquid',
	sources: [
		{
			source: Source.Hyperliquid_Rest,
			label: 'Hyperliquid REST',
		},
		{
			source: Source.Hyperliquid_JsonRpc,
			label: 'HyperEVM JSON-RPC',
		},
	],
	bindings: [
		bindings[Source.Hyperliquid_Rest],
		bindings[Source.Hyperliquid_JsonRpc],
	],
} satisfies SourceProviderDefinition
