// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const metadataVisionRestSourceDefinition = {
	provider: SourceProvider.MetadataVision,
	source: Source.MetadataVision_Rest,
	label: 'Metadata Vision REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default metadataVisionRestSourceDefinition
