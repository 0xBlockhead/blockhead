import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/StoicWallet/bindings.ts'

export default {
	provider: SourceProvider.StoicWallet,
	label: 'Stoic Wallet',
	sources: {
		[Source.StoicWallet_WalletApi]: {
			label: 'Stoic Wallet API',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
