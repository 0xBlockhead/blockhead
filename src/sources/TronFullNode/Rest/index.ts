// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition } from '$/sources/index.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.TronFullNode,
	source: Source.TronFullNode_Rest,
	label: 'TRON full node REST',
} satisfies SourceDefinition
