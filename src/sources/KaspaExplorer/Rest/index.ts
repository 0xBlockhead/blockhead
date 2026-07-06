// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const kaspaExplorerRestSourceDefinition = {
	provider: SourceProvider.KaspaExplorer,
	source: Source.KaspaExplorer_Rest,
	label: 'Kaspa Explorer REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default kaspaExplorerRestSourceDefinition
