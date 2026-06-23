import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { nodelyBindings } from '$/sources/Nodely/bindings.ts'

export default {
	provider: SourceProvider.Nodely,
	label: 'Nodely',
	sources: [
		{
			provider: SourceProvider.Nodely,
			source: Source.Nodely_Algod_Rest,
			label: 'Nodely Algod REST',
		},
		{
			provider: SourceProvider.Nodely,
			source: Source.Nodely_AlgorandIndexer_Rest,
			label: 'Nodely Algorand Indexer REST',
		},
	],
	bindings: nodelyBindings,
} satisfies SourceProviderDefinition
