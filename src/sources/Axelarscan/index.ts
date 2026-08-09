import bindings from '$/sources/Axelarscan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Axelarscan,
	label: 'Axelarscan',
	sources: {
		[Source.Axelarscan_Rest]: {
			label: 'Axelarscan REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
