import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Xaman/bindings.ts'

export default {
	provider: SourceProvider.Xaman,
	label: 'Xaman',
	sources: {
		[Source.Xaman_Api]: {
			label: 'Xaman API',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
