import bindings from '$/sources/CometBft/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.CometBft,
	label: 'CometBFT',
	sources: {
		[Source.CometBft_Rest]: {
			label: 'CometBFT REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
