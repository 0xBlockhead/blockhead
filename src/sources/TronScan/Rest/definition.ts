import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

export default {
	provider: SourceProvider.TronScan,
	source: Source.TronScan_Rest,
	label: 'TRONSCAN REST',
} satisfies SourceDefinition
