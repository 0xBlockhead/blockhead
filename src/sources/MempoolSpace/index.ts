// Generated from APP.ts.

import bindings from '$/sources/MempoolSpace/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.MempoolSpace,
	label: 'mempool.space',
	sources: [
		{
			source: Source.MempoolSpace_Rest,
			label: 'mempool.space REST',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
