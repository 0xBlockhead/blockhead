import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/index.ts'

const NeynarRestSource = {
	provider: SourceProvider.Neynar,
	source: Source.Neynar_Rest,
	label: 'Neynar Rest',
} satisfies SourceDefinition

export default NeynarRestSource
