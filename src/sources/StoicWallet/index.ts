import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { stoicWalletBindings } from '$/sources/StoicWallet/bindings.ts'

export default {
	provider: SourceProvider.StoicWallet,
	label: 'Stoic Wallet',
	sources: [
		{
			provider: SourceProvider.StoicWallet,
			source: Source.StoicWallet_WalletApi,
			label: 'Stoic Wallet API',
		},
	],
	bindings: stoicWalletBindings,
} satisfies SourceProviderDefinition
