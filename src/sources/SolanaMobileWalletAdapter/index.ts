import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { solanaMobileWalletAdapterBindings } from '$/sources/SolanaMobileWalletAdapter/bindings.ts'

export default {
	provider: SourceProvider.SolanaMobileWalletAdapter,
	label: 'Solana Mobile Wallet Adapter',
	sources: [
		{
			provider: SourceProvider.SolanaMobileWalletAdapter,
			source: Source.SolanaMobileWalletAdapter_WalletApi,
			label: 'Solana Mobile Wallet Adapter API',
		},
	],
	bindings: solanaMobileWalletAdapterBindings,
} satisfies SourceProviderDefinition
