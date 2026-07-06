// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const tronSolidityNodeRestSourceDefinition = {
	provider: SourceProvider.TronSolidityNode,
	source: Source.TronSolidityNode_Rest,
	label: 'TRON solidity node REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default tronSolidityNodeRestSourceDefinition
