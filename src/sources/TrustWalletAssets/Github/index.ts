// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const trustWalletAssetsGithubSourceDefinition = {
	provider: SourceProvider.TrustWalletAssets,
	source: Source.TrustWalletAssets_Github,
	label: 'Trust Wallet assets GitHub',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default trustWalletAssetsGithubSourceDefinition
