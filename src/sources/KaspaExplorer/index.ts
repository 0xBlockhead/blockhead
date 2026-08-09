import bindings from '$/sources/KaspaExplorer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.KaspaExplorer,
	label: 'Kaspa Explorer',
	sources: {
		[Source.KaspaExplorer]: {
			label: 'Kaspa Explorer',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
