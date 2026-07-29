// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Reth/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Reth,
	label: 'Reth',
	sources: [
		{
			source: Source.Reth_JsonRpc,
			label: 'Reth JSON-RPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
