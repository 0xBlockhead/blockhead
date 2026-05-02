import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

const HypersnapRestSource = {
	provider: SourceProvider.Hypersnap,
	source: Source.Hypersnap_Rest,
	label: 'Hypersnap Rest',
} satisfies SourceDefinition

export default HypersnapRestSource
