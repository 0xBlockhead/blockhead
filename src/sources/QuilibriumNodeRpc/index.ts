// Generated from APP.ts.

import bindings from '$/sources/QuilibriumNodeRpc/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.QuilibriumNodeRpc,
	label: 'Quilibrium node RPC',
	sources: [
		{
			source: Source.QuilibriumNodeRpc_Grpc,
			label: 'Quilibrium node gRPC',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
