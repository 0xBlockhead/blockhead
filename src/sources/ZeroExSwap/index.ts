// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
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
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
