import bindings from '$/sources/Avail/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Avail,
	label: 'Avail',
	sources: {
		[Source.Avail]: {
			label: 'Avail',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
