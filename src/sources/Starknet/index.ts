// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Starknet/bindings.ts'

export default {
	provider: SourceProvider.Starknet,
	label: 'Starknet',
	sources: [
		{
			source: Source.Starknet_JsonRpc,
			label: 'Starknet JSON-RPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
