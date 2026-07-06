// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const availExplorerRestSourceDefinition = {
	provider: SourceProvider.AvailExplorer,
	source: Source.AvailExplorer_Rest,
	label: 'Avail Explorer REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default availExplorerRestSourceDefinition
