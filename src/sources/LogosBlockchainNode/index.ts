import bindings from '$/sources/LogosBlockchainNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.LogosBlockchainNode,
	label: 'Logos blockchain node',
	sources: {
		[Source.LogosBlockchainNode_Rest]: {
			label: 'Logos blockchain node REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
