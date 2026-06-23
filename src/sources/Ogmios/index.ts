import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { ogmiosBindings } from '$/sources/Ogmios/bindings.ts'

export default {
	provider: SourceProvider.Ogmios,
	label: 'Ogmios',
	sources: [
		{
			provider: SourceProvider.Ogmios,
			source: Source.Ogmios_JsonRpc,
			label: 'Ogmios JSON-RPC',
		},
	],
	bindings: ogmiosBindings,
} satisfies SourceProviderDefinition
