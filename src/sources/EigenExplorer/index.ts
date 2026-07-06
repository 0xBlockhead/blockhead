// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const eigenExplorerRestSourceDefinition = {
	provider: SourceProvider.EigenExplorer,
	source: Source.EigenExplorer_Rest,
	label: 'EigenExplorer REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default eigenExplorerRestSourceDefinition
