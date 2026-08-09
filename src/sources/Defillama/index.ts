import bindings from '$/sources/Defillama/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Defillama,
	label: 'Defillama',
	sources: {
		[Source.Defillama_Rest]: {
			label: 'Defillama REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
