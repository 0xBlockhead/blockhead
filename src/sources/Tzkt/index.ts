import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { tzktBindings } from '$/sources/Tzkt/bindings.ts'

export default {
	provider: SourceProvider.Tzkt,
	label: 'TzKT',
	sources: [
		{
			provider: SourceProvider.Tzkt,
			source: Source.Tzkt_Rest,
			label: 'TzKT REST',
		},
	],
	bindings: tzktBindings,
} satisfies SourceProviderDefinition
