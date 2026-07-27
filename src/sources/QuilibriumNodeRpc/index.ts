// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/QuilibriumNodeRpc/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.QuilibriumNodeRpc,
	label: 'Quilibrium node RPC',
	sources: [
		{
			source: Source.QuilibriumNodeRpc_Grpc,
			label: 'Quilibrium node gRPC',
		},
	],
	bindings: [bindings[Source.QuilibriumNodeRpc_Grpc]],
} satisfies SourceProviderDefinition
