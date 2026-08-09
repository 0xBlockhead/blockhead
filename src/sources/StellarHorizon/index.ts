import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/StellarHorizon/bindings.ts'

export default {
	provider: SourceProvider.StellarHorizon,
	label: 'Stellar Horizon',
	sources: {
		[Source.StellarHorizon_Rest]: {
			label: 'Stellar Horizon REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
