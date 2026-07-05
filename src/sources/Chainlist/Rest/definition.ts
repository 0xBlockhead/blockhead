import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

const ChainlistRestSource = {
	provider: SourceProvider.Chainlist,
	source: Source.Chainlist_Rest,
	label: 'Chainlist Rest',
} satisfies SourceDefinition

export default ChainlistRestSource
