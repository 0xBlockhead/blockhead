import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { suiBindings } from '$/sources/Sui/bindings.ts'

export default {
	provider: SourceProvider.Sui,
	label: 'Sui',
	sources: [
		{
			provider: SourceProvider.Sui,
			source: Source.Sui_Graphql,
			label: 'Sui GraphQL',
		},
		{
			provider: SourceProvider.Sui,
			source: Source.Sui_Grpc,
			label: 'Sui gRPC',
		},
		{
			provider: SourceProvider.Sui,
			source: Source.Sui_JsonRpc,
			label: 'Sui JSON-RPC',
		},
	],
	bindings: suiBindings,
} satisfies SourceProviderDefinition
