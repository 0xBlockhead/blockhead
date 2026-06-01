import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { rawOrigin } from '$/sources/TrustWalletAssets/Github/constants.ts'
import TrustWalletAssetsGithubSource from '$/sources/TrustWalletAssets/Github/index.ts'

export default {
	provider: SourceProvider.TrustWalletAssets,
	label: 'TrustWallet Assets',
	origins: [
		{
			origin: rawOrigin,
			corsEnabled: false,
		},
	],
	sources: [
		TrustWalletAssetsGithubSource,
	],
} satisfies SourceProviderDefinition
