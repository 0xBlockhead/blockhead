// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/OneInchSwap/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.OneInchSwap,
	label: '1inch Swap',
	sources: [
		{
			source: Source.OneInchSwap_Rest,
			label: '1inch Swap REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
