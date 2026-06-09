import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import QuilibriumNodeRpcGrpc from '$/sources/QuilibriumNodeRpc/Grpc/index.ts'

export default {
	provider: SourceProvider.QuilibriumNodeRpc,
	label: 'Quilibrium node RPC',
	sources: [
		QuilibriumNodeRpcGrpc,
	],
} as const satisfies SourceProviderDefinition
