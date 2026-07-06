// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const cronosExplorerRestSourceDefinition = {
	provider: SourceProvider.CronosExplorer,
	source: Source.CronosExplorer_Rest,
	label: 'Cronos Explorer REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default cronosExplorerRestSourceDefinition
