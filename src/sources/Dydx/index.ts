import bindings from '$/sources/Dydx/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Dydx,
	label: 'dYdX',
	sources: {
		[Source.DydxIndexer]: {
			label: 'dYdX Indexer',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
