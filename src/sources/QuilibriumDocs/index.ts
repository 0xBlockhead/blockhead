// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const quilibriumDocsRestSourceDefinition = {
	provider: SourceProvider.QuilibriumDocs,
	source: Source.QuilibriumDocs_Rest,
	label: 'Quilibrium docs REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default quilibriumDocsRestSourceDefinition
