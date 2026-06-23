import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { walletConnectBindings } from '$/sources/WalletConnect/bindings.ts'

export default {
	provider: SourceProvider.WalletConnect,
	label: 'WalletConnect',
	sources: [
		{
			provider: SourceProvider.WalletConnect,
			source: Source.WalletConnect_SignClient,
			label: 'WalletConnect sign client',
		},
	],
	bindings: walletConnectBindings,
} satisfies SourceProviderDefinition
