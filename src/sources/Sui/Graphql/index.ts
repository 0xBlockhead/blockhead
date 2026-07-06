// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const suiGraphqlSourceDefinition = {
	provider: SourceProvider.Sui,
	source: Source.Sui_Graphql,
	label: 'Sui GraphQL',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default suiGraphqlSourceDefinition
