// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const nearWalletSelectorWalletApiSourceDefinition = {
	provider: SourceProvider.NearWalletSelector,
	source: Source.NearWalletSelector_WalletApi,
	label: 'NEAR Wallet Selector API',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default nearWalletSelectorWalletApiSourceDefinition
