import type { SourceDefinition } from '$/sources/$Source.ts'
import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'

const MevRelayRestSource = {
	provider: SourceProvider.MevRelay,
	source: Source.MevRelay_Rest,
	label: 'MEV-Boost relay',
} satisfies SourceDefinition

export default MevRelayRestSource
