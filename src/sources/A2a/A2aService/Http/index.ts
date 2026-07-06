// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const a2aServiceHttpSourceDefinition = {
	provider: SourceProvider.A2a,
	source: Source.A2aService_Http,
	label: 'A2A service HTTP',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default a2aServiceHttpSourceDefinition
