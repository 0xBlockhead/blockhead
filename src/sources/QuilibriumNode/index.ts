import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { quilibriumNodeBindings } from '$/sources/QuilibriumNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const quilibriumNodeOrigins = sourceOriginsFromBindings(quilibriumNodeBindings)

const quilibriumNodeSourceProviderDefinition = {
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
	origins: quilibriumNodeOrigins,
} satisfies SourceProviderDefinition

export default quilibriumNodeSourceProviderDefinition
