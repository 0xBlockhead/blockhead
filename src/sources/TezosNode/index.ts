// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
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
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
