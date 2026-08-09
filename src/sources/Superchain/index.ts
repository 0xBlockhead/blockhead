import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Superchain/bindings.ts'

export default {
	provider: SourceProvider.Superchain,
	label: 'Superchain',
	sources: {
		[Source.Superchain_Github]: {
			label: 'Superchain GitHub',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
