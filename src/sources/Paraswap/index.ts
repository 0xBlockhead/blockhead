// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Paraswap/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Paraswap,
	label: 'ParaSwap',
	sources: [
		{
			source: Source.Paraswap_Rest,
			label: 'ParaSwap REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
