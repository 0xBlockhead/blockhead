// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const logosDocsRestSourceDefinition = {
	provider: SourceProvider.LogosDocs,
	source: Source.LogosDocs_Rest,
	label: 'Logos docs REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default logosDocsRestSourceDefinition
