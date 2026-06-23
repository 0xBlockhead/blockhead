import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { logosBlockchainNodeBindings } from '$/sources/LogosBlockchainNode/bindings.ts'

export default {
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
} satisfies SourceProviderDefinition
