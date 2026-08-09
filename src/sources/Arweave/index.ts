import bindings from '$/sources/Arweave/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Arweave,
	label: 'Arweave',
	sources: {
		[Source.Arweave_Graphql]: {
			label: 'Arweave GraphQL',
		},
		[Source.Arweave_Rest]: {
			label: 'Arweave Gateway',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
