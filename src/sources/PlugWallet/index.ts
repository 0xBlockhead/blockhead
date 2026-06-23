import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { plugWalletBindings } from '$/sources/PlugWallet/bindings.ts'

export default {
	provider: SourceProvider.PlugWallet,
	label: 'Plug Wallet',
	sources: [
		{
			provider: SourceProvider.PlugWallet,
			source: Source.PlugWallet_WalletApi,
			label: 'Plug Wallet API',
		},
	],
	bindings: plugWalletBindings,
} satisfies SourceProviderDefinition
