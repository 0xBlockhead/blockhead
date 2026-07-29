// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Hyperliquid/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

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
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
