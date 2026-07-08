import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import { tezosNodeBindings } from '$/sources/TezosNode/bindings.ts'

const tezosNodeOrigins = sourceOriginsFromBindings(tezosNodeBindings)

const tezosNodeSourceProviderDefinition = {
	provider: SourceProvider.TezosNode,
	label: 'Tezos node RPC',
	sources: [
		{
			provider: SourceProvider.TezosNode,
			source: Source.TezosNode_Rpc,
			label: 'Tezos node RPC',
		},
	],
	bindings: tezosNodeBindings,
	origins: tezosNodeOrigins,
} satisfies SourceProviderDefinition

export default tezosNodeSourceProviderDefinition
