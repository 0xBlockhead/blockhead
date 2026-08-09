import bindings from '$/sources/Celenium/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Celenium,
	label: 'Celenium',
	sources: {
		[Source.Celenium_Rest]: {
			label: 'Celenium REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
