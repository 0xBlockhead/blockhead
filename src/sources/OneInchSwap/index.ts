// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/OneInchSwap/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.OneInchSwap,
	label: '1inch Swap',
	sources: [
		{
			source: Source.OneInchSwap_Rest,
			label: '1inch Swap REST',
		},
	],
	bindings: [bindings[Source.OneInchSwap_Rest]],
} satisfies SourceProviderDefinition
