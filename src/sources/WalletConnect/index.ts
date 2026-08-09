import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/WalletConnect/bindings.ts'

export default {
	provider: SourceProvider.WalletConnect,
	label: 'WalletConnect',
	sources: {
		[Source.WalletConnect_SignClient]: {
			label: 'WalletConnect sign client',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
