// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/WalletConnect/bindings.ts'

export default {
	provider: SourceProvider.WalletConnect,
	label: 'WalletConnect',
	sources: [
		{
			source: Source.WalletConnect_SignClient,
			label: 'WalletConnect sign client',
		},
	],
	bindings: [bindings[Source.WalletConnect_SignClient]],
} satisfies SourceProviderDefinition
