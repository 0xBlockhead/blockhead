import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { junoBindings } from '$/sources/Juno/bindings.ts'

export default {
	provider: SourceProvider.Juno,
	label: 'Juno',
	sources: [
		{
			provider: SourceProvider.Juno,
			source: Source.Juno_JsonRpc,
			label: 'Juno JSON-RPC',
		},
	],
	bindings: junoBindings,
} satisfies SourceProviderDefinition
