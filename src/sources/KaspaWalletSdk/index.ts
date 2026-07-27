// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/KaspaWalletSdk/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.KaspaWalletSdk,
	label: 'Kaspa wallet SDK',
	sources: [
		{
			source: Source.KaspaWalletSdk_WalletApi,
			label: 'Kaspa wallet SDK API',
		},
	],
	bindings: [bindings[Source.KaspaWalletSdk_WalletApi]],
} satisfies SourceProviderDefinition
