// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Sui/bindings.ts'

export default {
	provider: SourceProvider.Sui,
	label: 'Sui',
	sources: [
		{
			source: Source.Sui_Graphql,
			label: 'Sui GraphQL',
		},
		{
			source: Source.Sui_Grpc,
			label: 'Sui gRPC',
		},
		{
			source: Source.Sui_JsonRpc,
			label: 'Sui JSON-RPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
