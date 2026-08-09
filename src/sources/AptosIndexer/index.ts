import bindings from '$/sources/AptosIndexer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.AptosIndexer,
	label: 'Aptos Indexer',
	sources: {
		[Source.AptosIndexer_Graphql]: {
			label: 'Aptos Indexer GraphQL',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
