import bindings from '$/sources/Koios/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Koios,
	label: 'Koios',
	sources: {
		[Source.Koios_Rest]: {
			label: 'Koios REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
