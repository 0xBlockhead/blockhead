// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/StellarRpc/bindings.ts'

export default {
	provider: SourceProvider.StellarRpc,
	label: 'Stellar RPC',
	sources: [
		{
			source: Source.StellarRpc_JsonRpc,
			label: 'Stellar RPC JSON-RPC',
		},
	],
	bindings: [bindings[Source.StellarRpc_JsonRpc]],
} satisfies SourceProviderDefinition
