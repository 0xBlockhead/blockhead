// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/AptosIndexer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.AptosIndexer,
	label: 'Aptos Indexer',
	sources: [
		{
			source: Source.AptosIndexer_Graphql,
			label: 'Aptos Indexer GraphQL',
		},
	],
	bindings: [bindings[Source.AptosIndexer_Graphql]],
} satisfies SourceProviderDefinition
