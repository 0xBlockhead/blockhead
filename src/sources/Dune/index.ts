import bindings from '$/sources/Dune/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Dune,
	label: 'Dune',
	sources: {
		[Source.Dune_Rest]: {
			label: 'Dune REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
