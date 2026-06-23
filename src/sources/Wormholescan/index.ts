import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { wormholescanBindings } from '$/sources/Wormholescan/bindings.ts'

export default {
	provider: SourceProvider.Wormholescan,
	label: 'Wormholescan',
	sources: [
		{
			provider: SourceProvider.Wormholescan,
			source: Source.Wormholescan_Rest,
			label: 'Wormholescan REST',
		},
	],
	bindings: wormholescanBindings,
} satisfies SourceProviderDefinition
