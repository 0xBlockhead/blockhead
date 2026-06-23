import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { litecoinCoreBindings } from '$/sources/LitecoinCore/bindings.ts'

export default {
	provider: SourceProvider.LitecoinCore,
	label: 'Litecoin Core',
	sources: [
		{
			provider: SourceProvider.LitecoinCore,
			source: Source.LitecoinCore_JsonRpc,
			label: 'Litecoin Core JSON-RPC',
		},
	],
	bindings: litecoinCoreBindings,
} satisfies SourceProviderDefinition
