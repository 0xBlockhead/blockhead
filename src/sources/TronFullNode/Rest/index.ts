// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const tronFullNodeRestSourceDefinition = {
	provider: SourceProvider.TronFullNode,
	source: Source.TronFullNode_Rest,
	label: 'TRON full node REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default tronFullNodeRestSourceDefinition
