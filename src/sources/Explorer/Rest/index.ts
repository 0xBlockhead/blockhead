import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

const ExplorerRestSource = {
	provider: SourceProvider.Explorer,
	source: Source.Explorer_Rest,
	label: 'Explorer Rest',
} satisfies SourceDefinition

export default ExplorerRestSource
