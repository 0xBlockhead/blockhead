import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { dogecoinCoreBindings } from '$/sources/DogecoinCore/bindings.ts'

export default {
	provider: SourceProvider.DogecoinCore,
	label: 'Dogecoin Core',
	sources: [
		{
			provider: SourceProvider.DogecoinCore,
			source: Source.DogecoinCore_JsonRpc,
			label: 'Dogecoin Core JSON-RPC',
		},
	],
	bindings: dogecoinCoreBindings,
} satisfies SourceProviderDefinition
