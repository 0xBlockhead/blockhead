import bindings from '$/sources/Reddit/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Reddit,
	label: 'Reddit',
	sources: {
		[Source.Reddit_Rest]: {
			label: 'Reddit OAuth REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
