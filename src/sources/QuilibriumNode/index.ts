// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/QuilibriumNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.QuilibriumNode,
	label: 'Quilibrium node',
	sources: [
		{
			source: Source.QuilibriumNode_Grpc,
			label: 'Quilibrium node gRPC',
		},
	],
	bindings: [bindings[Source.QuilibriumNode_Grpc]],
} satisfies SourceProviderDefinition
