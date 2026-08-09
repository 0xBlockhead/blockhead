import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Wormholescan/bindings.ts'

export default {
	provider: SourceProvider.Wormholescan,
	label: 'Wormholescan',
	sources: {
		[Source.Wormholescan]: {
			label: 'Wormholescan',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
