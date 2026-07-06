// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const ambossGraphqlSourceDefinition = {
	provider: SourceProvider.Amboss,
	source: Source.Amboss_Graphql,
	label: 'Amboss Space GraphQL',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default ambossGraphqlSourceDefinition
