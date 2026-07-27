// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/BnbChainFusion/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.BnbChainFusion,
	label: 'BNB Chain Fusion',
	sources: [
		{
			source: Source.BnbChainFusion_Rest,
			label: 'BNB Chain Fusion REST',
		},
	],
	bindings: [bindings[Source.BnbChainFusion_Rest]],
} satisfies SourceProviderDefinition
