// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const lensGraphqlSourceDefinition = {
	provider: SourceProvider.Lens,
	source: Source.Lens_Graphql,
	label: 'Lens GraphQL',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default lensGraphqlSourceDefinition
