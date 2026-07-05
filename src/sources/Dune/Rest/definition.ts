import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

const DuneRestSource = {
	provider: SourceProvider.Dune,
	source: Source.Dune_Rest,
	label: 'Dune Rest',
} satisfies SourceDefinition

export default DuneRestSource
