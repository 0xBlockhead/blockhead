import bindings from '$/sources/MistralAi/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.MistralAi,
	label: 'Mistral AI',
	sources: {
		[Source.MistralAi_Rest]: {
			label: 'Mistral AI REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
