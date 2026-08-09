import bindings from '$/sources/Mintscan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Mintscan,
	label: 'Mintscan',
	sources: {
		[Source.Mintscan]: {
			label: 'Mintscan',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
