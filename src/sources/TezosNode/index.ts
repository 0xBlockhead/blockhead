// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition } from '$/sources/index.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.TezosNode,
	source: Source.TezosNode_Rpc,
	label: 'Tezos node RPC',
} satisfies SourceDefinition
