// Generated from APP.ts.

import bindings from '$/sources/LightningMempoolSpace/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.LightningMempoolSpace,
	label: 'mempool.space Lightning',
	sources: [
		{
			source: Source.LightningMempoolSpace_Rest,
			label: 'mempool.space Lightning REST',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
