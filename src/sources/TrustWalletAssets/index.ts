// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/TrustWalletAssets/bindings.ts'

export default {
	provider: SourceProvider.TrustWalletAssets,
	label: 'Trust Wallet Assets',
	sources: [
		{
			source: Source.TrustWalletAssets_Github,
			label: 'Trust Wallet Assets GitHub',
		},
	],
	bindings: [bindings[Source.TrustWalletAssets_Github]],
} satisfies SourceProviderDefinition
