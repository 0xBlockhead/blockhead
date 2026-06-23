import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { algorandIndexerBindings } from '$/sources/AlgorandIndexer/bindings.ts'

export default {
	provider: SourceProvider.AlgorandIndexer,
	label: 'Algorand Indexer',
	sources: [
		{
			provider: SourceProvider.AlgorandIndexer,
			source: Source.AlgorandIndexer_Rest,
			label: 'Algorand Indexer REST',
		},
	],
	bindings: algorandIndexerBindings,
} satisfies SourceProviderDefinition
