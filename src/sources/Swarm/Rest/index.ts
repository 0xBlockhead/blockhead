// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const swarmRestSourceDefinition = {
	provider: SourceProvider.Swarm,
	source: Source.Swarm_Rest,
	label: 'Swarm gateway',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default swarmRestSourceDefinition
