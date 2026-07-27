// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/CardanoKoios/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.CardanoKoios,
	label: 'Cardano Koios',
	sources: [
		{
			source: Source.CardanoKoios_Rest,
			label: 'Cardano Koios REST',
		},
	],
	bindings: [bindings[Source.CardanoKoios_Rest]],
} satisfies SourceProviderDefinition
