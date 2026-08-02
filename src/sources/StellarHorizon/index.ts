// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/StellarHorizon/bindings.ts'

export default {
	provider: SourceProvider.StellarHorizon,
	label: 'Stellar Horizon',
	sources: [
		{
			source: Source.StellarHorizon_Rest,
			label: 'Stellar Horizon REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
