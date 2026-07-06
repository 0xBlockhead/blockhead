// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const cycloneDxDocumentLocalSourceDefinition = {
	provider: SourceProvider.CycloneDx,
	source: Source.CycloneDxDocument_Local,
	label: 'CycloneDX document',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default cycloneDxDocumentLocalSourceDefinition
