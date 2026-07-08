import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import { starknetBindings } from '$/sources/Starknet/bindings.ts'

const starknetOrigins = sourceOriginsFromBindings(starknetBindings)

const starknetSourceProviderDefinition = {
	provider: SourceProvider.Starknet,
	label: 'Starknet',
	sources: [
		{
			provider: SourceProvider.Starknet,
			source: Source.Starknet_JsonRpc,
			label: 'Starknet JSON-RPC',
		},
	],
	bindings: starknetBindings,
	origins: starknetOrigins,
} satisfies SourceProviderDefinition

export default starknetSourceProviderDefinition
