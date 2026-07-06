// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const walletStandardWalletApiSourceDefinition = {
	provider: SourceProvider.WalletStandard,
	source: Source.WalletStandard_WalletApi,
	label: 'Wallet Standard API',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default walletStandardWalletApiSourceDefinition
