import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { quilibriumNodeBindings } from '$/sources/QuilibriumNode/bindings.ts'

export default {
	provider: SourceProvider.QuilibriumNode,
	label: 'Quilibrium node',
	sources: [
		{
			provider: SourceProvider.QuilibriumNode,
			source: Source.QuilibriumNode_Grpc,
			label: 'Quilibrium node gRPC',
		},
	],
	bindings: quilibriumNodeBindings,
} satisfies SourceProviderDefinition
