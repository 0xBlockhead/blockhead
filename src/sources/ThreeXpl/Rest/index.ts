import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

const ThreeXplRestSource = {
	provider: SourceProvider.ThreeXpl,
	source: Source.ThreeXpl_Rest,
	label: '3xpl REST',
} satisfies SourceDefinition

export default ThreeXplRestSource
