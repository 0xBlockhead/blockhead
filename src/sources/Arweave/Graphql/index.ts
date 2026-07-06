// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const arweaveGraphqlSourceDefinition = {
	provider: SourceProvider.Arweave,
	source: Source.Arweave_Graphql,
	label: 'Arweave GraphQL',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default arweaveGraphqlSourceDefinition
