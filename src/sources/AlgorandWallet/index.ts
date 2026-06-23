import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { algorandWalletBindings } from '$/sources/AlgorandWallet/bindings.ts'

export default {
	provider: SourceProvider.AlgorandWallet,
	label: 'Algorand wallet',
	sources: [
		{
			provider: SourceProvider.AlgorandWallet,
			source: Source.AlgorandWallet_WalletApi,
			label: 'Algorand wallet API',
		},
	],
	bindings: algorandWalletBindings,
} satisfies SourceProviderDefinition
