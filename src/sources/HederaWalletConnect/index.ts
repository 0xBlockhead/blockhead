import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { hederaWalletConnectBindings } from '$/sources/HederaWalletConnect/bindings.ts'

export default {
	provider: SourceProvider.HederaWalletConnect,
	label: 'Hedera WalletConnect',
	sources: [
		{
			provider: SourceProvider.HederaWalletConnect,
			source: Source.HederaWalletConnect_SignClient,
			label: 'Hedera WalletConnect sign client',
		},
	],
	bindings: hederaWalletConnectBindings,
} satisfies SourceProviderDefinition
