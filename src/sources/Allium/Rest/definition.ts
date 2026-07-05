import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

const AlliumRestSource = {
	provider: SourceProvider.Allium,
	source: Source.Allium_Rest,
	label: 'Allium Rest',
} satisfies SourceDefinition

export default AlliumRestSource
