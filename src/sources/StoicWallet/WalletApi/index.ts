// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const stoicWalletWalletApiSourceDefinition = {
	provider: SourceProvider.StoicWallet,
	source: Source.StoicWallet_WalletApi,
	label: 'Stoic Wallet API',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default stoicWalletWalletApiSourceDefinition
