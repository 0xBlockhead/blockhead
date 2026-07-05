import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

const BlockscoutRestSource = {
	provider: SourceProvider.Blockscout,
	source: Source.Blockscout_Rest,
	label: 'Blockscout Rest',
} satisfies SourceDefinition

export default BlockscoutRestSource
