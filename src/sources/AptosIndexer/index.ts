import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { aptosIndexerBindings } from '$/sources/AptosIndexer/bindings.ts'

export default {
	provider: SourceProvider.AptosIndexer,
	label: 'Aptos Indexer',
	sources: [
		{
			provider: SourceProvider.AptosIndexer,
			source: Source.AptosIndexer_Graphql,
			label: 'Aptos Indexer GraphQL',
		},
	],
	bindings: aptosIndexerBindings,
} satisfies SourceProviderDefinition
