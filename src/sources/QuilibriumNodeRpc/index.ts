import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { quilibriumNodeRpcBindings } from '$/sources/QuilibriumNodeRpc/bindings.ts'

export default {
	provider: SourceProvider.QuilibriumNodeRpc,
	label: 'Quilibrium node RPC',
	sources: [
		{
			provider: SourceProvider.QuilibriumNodeRpc,
			source: Source.QuilibriumNodeRpc_Grpc,
			label: 'Quilibrium node gRPC',
		},
	],
	bindings: quilibriumNodeRpcBindings,
} satisfies SourceProviderDefinition
