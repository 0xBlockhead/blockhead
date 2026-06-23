import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { starknetBindings } from '$/sources/Starknet/bindings.ts'

export default {
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
} satisfies SourceProviderDefinition
