import bindings from '$/sources/QuilibriumNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.QuilibriumNode,
	label: 'Quilibrium node',
	sources: {
		[Source.QuilibriumNode_Grpc]: {
			label: 'Quilibrium node gRPC',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
