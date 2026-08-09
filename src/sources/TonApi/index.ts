import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/TonApi/bindings.ts'

export default {
	provider: SourceProvider.TonApi,
	label: 'TonAPI',
	sources: {
		[Source.TonApi_Rest]: {
			label: 'TonAPI REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
