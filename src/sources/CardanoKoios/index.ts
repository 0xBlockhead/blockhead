import bindings from '$/sources/CardanoKoios/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.CardanoKoios,
	label: 'Cardano Koios',
	sources: {
		[Source.CardanoKoios_Rest]: {
			label: 'Cardano Koios REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
