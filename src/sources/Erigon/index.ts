import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { erigonBindings } from '$/sources/Erigon/bindings.ts'

export default {
	provider: SourceProvider.Erigon,
	label: 'Erigon',
	sources: [
		{
			provider: SourceProvider.Erigon,
			source: Source.Erigon_JsonRpc,
			label: 'Erigon JSON-RPC',
		},
	],
	bindings: erigonBindings,
} satisfies SourceProviderDefinition
