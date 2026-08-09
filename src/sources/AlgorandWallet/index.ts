import bindings from '$/sources/AlgorandWallet/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.AlgorandWallet,
	label: 'Algorand wallet',
	sources: {
		[Source.AlgorandWallet_WalletApi]: {
			label: 'Algorand wallet API',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
