import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

const LifiRestSource = {
	provider: SourceProvider.Lifi,
	source: Source.Lifi_Rest,
	label: 'Lifi Rest',
} satisfies SourceDefinition

export default LifiRestSource
