import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { celestiaBindings } from '$/sources/Celestia/bindings.ts'

export default {
	provider: SourceProvider.Celestia,
	label: 'Celestia',
	sources: [
		{
			provider: SourceProvider.Celestia,
			source: Source.Celestia_JsonRpc,
			label: 'Celestia JSON-RPC',
		},
	],
	bindings: celestiaBindings,
} satisfies SourceProviderDefinition
