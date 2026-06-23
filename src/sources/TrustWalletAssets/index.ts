import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { trustWalletAssetsBindings } from '$/sources/TrustWalletAssets/bindings.ts'

export default {
	provider: SourceProvider.TrustWalletAssets,
	label: 'Trust Wallet Assets',
	sources: [
		{
			provider: SourceProvider.TrustWalletAssets,
			source: Source.TrustWalletAssets_Github,
			label: 'Trust Wallet Assets GitHub',
		},
	],
	bindings: trustWalletAssetsBindings,
} satisfies SourceProviderDefinition
