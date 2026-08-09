import bindings from '$/sources/Lifi/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Lifi,
	label: 'LI.FI',
	sources: {
		[Source.Lifi_Rest]: {
			label: 'LI.FI REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
