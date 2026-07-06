// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const duneRestSourceDefinition = {
	provider: SourceProvider.Dune,
	source: Source.Dune_Rest,
	label: 'Dune REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default duneRestSourceDefinition
