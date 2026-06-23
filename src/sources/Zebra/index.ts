import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { zebraBindings } from '$/sources/Zebra/bindings.ts'

export default {
	provider: SourceProvider.Zebra,
	label: 'Zebra',
	sources: [
		{
			provider: SourceProvider.Zebra,
			source: Source.Zebra_JsonRpc,
			label: 'Zebra JSON-RPC',
		},
	],
	bindings: zebraBindings,
} satisfies SourceProviderDefinition
