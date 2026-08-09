import bindings from '$/sources/GoogleAi/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.GoogleAi,
	label: 'Google AI',
	sources: {
		[Source.GoogleAi_Rest]: {
			label: 'Google AI REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
