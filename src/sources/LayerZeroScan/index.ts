// Generated from APP.ts.

import bindings from '$/sources/LayerZeroScan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.LayerZeroScan,
	label: 'LayerZero Scan',
	sources: [
		{
			source: Source.LayerZeroScan_Rest,
			label: 'LayerZero Scan REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
