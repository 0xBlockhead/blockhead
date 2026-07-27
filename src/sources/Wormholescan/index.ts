// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/Wormholescan/bindings.ts'

export default {
	provider: SourceProvider.Wormholescan,
	label: 'Wormholescan',
	sources: [
		{
			source: Source.Wormholescan_Rest,
			label: 'Wormholescan REST',
		},
	],
	bindings: [bindings[Source.Wormholescan_Rest]],
} satisfies SourceProviderDefinition
