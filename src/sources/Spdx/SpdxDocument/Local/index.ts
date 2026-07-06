// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const spdxDocumentLocalSourceDefinition = {
	provider: SourceProvider.Spdx,
	source: Source.SpdxDocument_Local,
	label: 'SPDX document',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default spdxDocumentLocalSourceDefinition
