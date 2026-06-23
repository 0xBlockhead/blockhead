import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { rethBindings } from '$/sources/Reth/bindings.ts'

export default {
	provider: SourceProvider.Reth,
	label: 'Reth',
	sources: [
		{
			provider: SourceProvider.Reth,
			source: Source.Reth_JsonRpc,
			label: 'Reth JSON-RPC',
		},
	],
	bindings: rethBindings,
} satisfies SourceProviderDefinition
