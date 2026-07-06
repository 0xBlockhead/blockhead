// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const cosmosAdrsGithubSourceDefinition = {
	provider: SourceProvider.CosmosAdrs,
	source: Source.CosmosAdrs_Github,
	label: 'Cosmos ADRs GitHub',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default cosmosAdrsGithubSourceDefinition
