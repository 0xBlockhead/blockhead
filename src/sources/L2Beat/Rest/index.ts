import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/index.ts'

const L2BeatRestSource = {
	provider: SourceProvider.L2Beat,
	source: Source.L2Beat_Rest,
	label: 'L2Beat Rest',
} satisfies SourceDefinition

export default L2BeatRestSource
