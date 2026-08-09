import bindings from '$/sources/HederaWalletConnect/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.HederaWalletConnect,
	label: 'Hedera WalletConnect',
	sources: {
		[Source.HederaWalletConnect_SignClient]: {
			label: 'Hedera WalletConnect sign client',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
