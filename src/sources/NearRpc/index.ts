// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/NearRpc/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.NearRpc,
	label: 'NEAR RPC',
	sources: [
		{
			source: Source.NearRpc_JsonRpc,
			label: 'NEAR JSON-RPC',
		},
	],
	bindings: [bindings[Source.NearRpc_JsonRpc]],
} satisfies SourceProviderDefinition
