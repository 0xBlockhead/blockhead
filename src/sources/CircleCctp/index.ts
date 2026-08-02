// Generated from APP.ts.

import bindings from '$/sources/CircleCctp/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.CircleCctp,
	label: 'Circle CCTP',
	sources: {
		[Source.CircleCctpIris]: {
			label: 'Circle CCTP Iris',
		},
		[Source.CircleCctpContracts_Evm]: {
			label: 'Circle CCTP EVM contracts',
		},
		[Source.CircleCctpContracts_Solana]: {
			label: 'Circle CCTP Solana contracts',
		},
		[Source.CircleCctpContracts_Stellar]: {
			label: 'Circle CCTP Stellar contracts',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
