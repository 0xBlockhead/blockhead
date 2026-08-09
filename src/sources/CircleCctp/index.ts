import bindings from '$/sources/CircleCctp/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.CircleCctp,
	label: 'Circle CCTP',
	sources: {
		[Source.CircleCctpContracts_Evm]: {
			label: 'Circle CCTP EVM contracts',
		},
		[Source.CircleCctpContracts_Solana]: {
			label: 'Circle CCTP Solana contracts',
		},
		[Source.CircleCctpContracts_Stellar]: {
			label: 'Circle CCTP Stellar contracts',
		},
		[Source.CircleCctpIris]: {
			label: 'Circle CCTP Iris',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
