import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { tezosNodeBindings } from '$/sources/TezosNode/bindings.ts'

export default {
	provider: SourceProvider.TezosNode,
	label: 'Tezos node',
	sources: [
		{
			provider: SourceProvider.TezosNode,
			source: Source.TezosNode_Rpc,
			label: 'Tezos node RPC',
		},
	],
	bindings: tezosNodeBindings,
} satisfies SourceProviderDefinition
