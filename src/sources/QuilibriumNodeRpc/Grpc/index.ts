import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'

export default {
	provider: SourceProvider.QuilibriumNodeRpc,
	source: Source.QuilibriumNodeRpc_Grpc,
	label: 'Quilibrium node gRPC',
} as const
