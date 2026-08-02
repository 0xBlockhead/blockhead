// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/TrustWalletAssets/bindings.ts'

export default {
	provider: SourceProvider.TrustWalletAssets,
	label: 'Trust Wallet Assets',
	sources: {
		[Source.TrustWalletAssets_Github]: {
			label: 'Trust Wallet Assets GitHub',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
