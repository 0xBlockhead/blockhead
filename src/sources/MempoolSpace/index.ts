// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/MempoolSpace/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.MempoolSpace,
	label: 'mempool.space',
	sources: [
		{
			source: Source.MempoolSpace_Rest,
			label: 'mempool.space REST',
		},
	],
	bindings: [bindings[Source.MempoolSpace_Rest]],
} satisfies SourceProviderDefinition
