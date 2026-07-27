// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/LightningMempoolSpace/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.LightningMempoolSpace,
	label: 'mempool.space Lightning',
	sources: [
		{
			source: Source.LightningMempoolSpace_Rest,
			label: 'mempool.space Lightning REST',
		},
	],
	bindings: [bindings[Source.LightningMempoolSpace_Rest]],
} satisfies SourceProviderDefinition
