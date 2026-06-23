import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { kaswareWalletBindings } from '$/sources/KaswareWallet/bindings.ts'

export default {
	provider: SourceProvider.KaswareWallet,
	label: 'Kasware Wallet',
	sources: [
		{
			provider: SourceProvider.KaswareWallet,
			source: Source.KaswareWallet_WalletApi,
			label: 'Kasware Wallet API',
		},
	],
	bindings: kaswareWalletBindings,
} satisfies SourceProviderDefinition
