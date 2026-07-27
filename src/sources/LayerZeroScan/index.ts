// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/LayerZeroScan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.LayerZeroScan,
	label: 'LayerZero Scan',
	sources: [
		{
			source: Source.LayerZeroScan_Rest,
			label: 'LayerZero Scan REST',
		},
	],
	bindings: [bindings[Source.LayerZeroScan_Rest]],
} satisfies SourceProviderDefinition
