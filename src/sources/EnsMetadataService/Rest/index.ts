// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const ensMetadataServiceRestSourceDefinition = {
	provider: SourceProvider.EnsMetadataService,
	source: Source.EnsMetadataService_Rest,
	label: 'ENS metadata service REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default ensMetadataServiceRestSourceDefinition
