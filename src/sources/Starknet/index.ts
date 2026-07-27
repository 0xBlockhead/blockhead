// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
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
	bindings: [bindings[Source.Starknet_JsonRpc]],
} satisfies SourceProviderDefinition
