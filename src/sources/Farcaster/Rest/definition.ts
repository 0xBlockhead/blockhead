import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

const FarcasterRestSource = {
	provider: SourceProvider.Farcaster,
	source: Source.Farcaster_Rest,
	label: 'Farcaster Rest',
} satisfies SourceDefinition

export default FarcasterRestSource
