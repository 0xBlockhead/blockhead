// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const tezosNodeRpcSourceDefinition = {
	provider: SourceProvider.TezosNode,
	source: Source.TezosNode_Rpc,
	label: 'Tezos node RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default tezosNodeRpcSourceDefinition
