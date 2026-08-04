// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Uniswap/bindings.ts'

export default {
	provider: SourceProvider.Uniswap,
	label: 'Uniswap',
	sources: {
		[Source.UniswapContracts_Evm]: {
			label: 'Uniswap V3 contract catalog',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
