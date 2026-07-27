// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/TezosNode/bindings.ts'

export default {
	provider: SourceProvider.TezosNode,
	label: 'Tezos node RPC',
	sources: [
		{
			source: Source.TezosNode_Rpc,
			label: 'Tezos node RPC',
		},
	],
	bindings: [bindings[Source.TezosNode_Rpc]],
} satisfies SourceProviderDefinition
