import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/index.ts'

export default {
	provider: SourceProvider.Beacon,
	source: Source.Beacon_Rest,
	label: 'Beacon (consensus) REST',
} satisfies SourceDefinition
