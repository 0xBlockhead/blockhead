import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { availBindings } from '$/sources/Avail/bindings.ts'

export default {
	provider: SourceProvider.Avail,
	label: 'Avail',
	sources: [
		{
			provider: SourceProvider.Avail,
			source: Source.Avail_JsonRpc,
			label: 'Avail JSON-RPC',
		},
	],
	bindings: availBindings,
} satisfies SourceProviderDefinition
