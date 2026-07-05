import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

const SwarmRestSource = {
	provider: SourceProvider.Swarm,
	source: Source.Swarm_Rest,
	label: 'Swarm Rest',
} satisfies SourceDefinition

export default SwarmRestSource
