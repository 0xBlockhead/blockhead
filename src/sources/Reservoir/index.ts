import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { reservoirBindings } from '$/sources/Reservoir/bindings.ts'

export default {
	provider: SourceProvider.Reservoir,
	label: 'Reservoir',
	sources: [
		{
			provider: SourceProvider.Reservoir,
			source: Source.Reservoir_Rest,
			label: 'Reservoir REST',
		},
	],
	bindings: reservoirBindings,
} satisfies SourceProviderDefinition
