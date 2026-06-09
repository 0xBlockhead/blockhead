import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/index.ts'

export default {
	provider: SourceProvider.TronGrid,
	source: Source.TronGrid_Rest,
	label: 'TronGrid REST',
} satisfies SourceDefinition
