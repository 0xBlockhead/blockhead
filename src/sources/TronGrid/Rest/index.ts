// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const tronGridRestSourceDefinition = {
	provider: SourceProvider.TronGrid,
	source: Source.TronGrid_Rest,
	label: 'TronGrid REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default tronGridRestSourceDefinition
