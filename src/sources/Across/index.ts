import bindings from '$/sources/Across/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Across,
	label: 'Across',
	sources: {
		[Source.Across_Rest]: {
			label: 'Across REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
