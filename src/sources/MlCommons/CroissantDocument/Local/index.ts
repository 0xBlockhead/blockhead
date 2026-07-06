// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const croissantDocumentLocalSourceDefinition = {
	provider: SourceProvider.MlCommons,
	source: Source.CroissantDocument_Local,
	label: 'Croissant document',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default croissantDocumentLocalSourceDefinition
