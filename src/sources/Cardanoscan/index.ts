import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { cardanoscanBindings } from '$/sources/Cardanoscan/bindings.ts'

export default {
	provider: SourceProvider.Cardanoscan,
	label: 'Cardanoscan',
	sources: [
		{
			provider: SourceProvider.Cardanoscan,
			source: Source.Cardanoscan_Rest,
			label: 'Cardanoscan REST',
		},
	],
	bindings: cardanoscanBindings,
} satisfies SourceProviderDefinition
