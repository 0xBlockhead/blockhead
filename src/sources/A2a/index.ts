// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const a2aWellKnownHttpSourceDefinition = {
	provider: SourceProvider.A2a,
	source: Source.A2aWellKnown_Http,
	label: 'A2A well-known agent card',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default a2aWellKnownHttpSourceDefinition
