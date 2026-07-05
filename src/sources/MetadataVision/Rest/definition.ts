import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

const MetadataVisionRestSource = {
	provider: SourceProvider.MetadataVision,
	source: Source.MetadataVision_Rest,
	label: 'Metadata Vision Open Graph',
} satisfies SourceDefinition

export default MetadataVisionRestSource
