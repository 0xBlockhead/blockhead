// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const nearNepsGithubSourceDefinition = {
	provider: SourceProvider.NearNeps,
	source: Source.NearNeps_Github,
	label: 'NEAR NEPs GitHub',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default nearNepsGithubSourceDefinition
