// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/TronScan/bindings.ts'

export default {
	provider: SourceProvider.TronScan,
	label: 'TRONSCAN',
	sources: [
		{
			source: Source.TronScan_Rest,
			label: 'TRONSCAN REST',
		},
	],
	bindings: [bindings[Source.TronScan_Rest]],
} satisfies SourceProviderDefinition
