import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

const TrustWalletAssetsGithubSource = {
	provider: SourceProvider.TrustWalletAssets,
	source: Source.TrustWalletAssets_Github,
	label: 'TrustWallet Assets GitHub',
} satisfies SourceDefinition

export default TrustWalletAssetsGithubSource
