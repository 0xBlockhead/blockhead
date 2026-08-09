import bindings from '$/sources/SolanaMobileWalletAdapter/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.SolanaMobileWalletAdapter,
	label: 'Solana Mobile Wallet Adapter',
	sources: {
		[Source.SolanaMobileWalletAdapter_WalletApi]: {
			label: 'Solana Mobile Wallet Adapter API',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
