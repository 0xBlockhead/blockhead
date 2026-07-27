// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/ZeroExSwap/bindings.ts'

export default {
	provider: SourceProvider.ZeroExSwap,
	label: '0x Swap',
	sources: [
		{
			source: Source.ZeroExSwap_Rest,
			label: '0x Swap REST',
		},
	],
	bindings: [bindings[Source.ZeroExSwap_Rest]],
} satisfies SourceProviderDefinition
