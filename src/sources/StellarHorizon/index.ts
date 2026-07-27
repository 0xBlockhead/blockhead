// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
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
	bindings: [bindings[Source.StellarHorizon_Rest]],
} satisfies SourceProviderDefinition
