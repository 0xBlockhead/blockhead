import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { logosBlockchainNodeBindings } from '$/sources/LogosBlockchainNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const logosBlockchainNodeOrigins = sourceOriginsFromBindings(logosBlockchainNodeBindings)

const logosBlockchainNodeSourceProviderDefinition = {
	provider: SourceProvider.LogosBlockchainNode,
	label: 'Logos blockchain node',
	sources: [
		{
			provider: SourceProvider.LogosBlockchainNode,
			source: Source.LogosBlockchainNode_Rest,
			label: 'Logos blockchain node REST',
		},
	],
	bindings: logosBlockchainNodeBindings,
	origins: logosBlockchainNodeOrigins,
} satisfies SourceProviderDefinition

export default logosBlockchainNodeSourceProviderDefinition
