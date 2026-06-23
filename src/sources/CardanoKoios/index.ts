import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { cardanoKoiosBindings } from '$/sources/CardanoKoios/bindings.ts'

export default {
	provider: SourceProvider.CardanoKoios,
	label: 'Cardano Koios',
	sources: [
		{
			provider: SourceProvider.CardanoKoios,
			source: Source.CardanoKoios_Rest,
			label: 'Cardano Koios REST',
		},
	],
	bindings: cardanoKoiosBindings,
} satisfies SourceProviderDefinition
