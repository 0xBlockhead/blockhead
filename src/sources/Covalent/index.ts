import bindings from '$/sources/Covalent/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Covalent,
	label: 'Covalent',
	sources: {
		[Source.GoldRushFoundational_Rest]: {
			label: 'GoldRush Foundational API',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
