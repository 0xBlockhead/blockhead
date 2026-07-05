import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

export default {
	provider: SourceProvider.TronFullNode,
	source: Source.TronFullNode_Rest,
	label: 'TRON FullNode REST',
} satisfies SourceDefinition
