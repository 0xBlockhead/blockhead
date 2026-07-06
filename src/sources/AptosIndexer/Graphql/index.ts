// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const aptosIndexerGraphqlSourceDefinition = {
	provider: SourceProvider.AptosIndexer,
	source: Source.AptosIndexer_Graphql,
	label: 'Aptos Indexer GraphQL',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default aptosIndexerGraphqlSourceDefinition
