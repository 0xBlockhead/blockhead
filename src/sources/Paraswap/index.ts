// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Paraswap/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Paraswap,
	label: 'ParaSwap',
	sources: [
		{
			source: Source.Paraswap_Rest,
			label: 'ParaSwap REST',
		},
	],
	bindings: [bindings[Source.Paraswap_Rest]],
} satisfies SourceProviderDefinition
