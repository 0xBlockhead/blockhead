// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/HederaWalletConnect/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.HederaWalletConnect,
	label: 'Hedera WalletConnect',
	sources: [
		{
			source: Source.HederaWalletConnect_SignClient,
			label: 'Hedera WalletConnect sign client',
		},
	],
	bindings: [bindings[Source.HederaWalletConnect_SignClient]],
} satisfies SourceProviderDefinition
