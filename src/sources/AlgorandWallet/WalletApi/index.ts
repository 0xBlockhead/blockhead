// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const algorandWalletWalletApiSourceDefinition = {
	provider: SourceProvider.AlgorandWallet,
	source: Source.AlgorandWallet_WalletApi,
	label: 'Algorand wallet API',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default algorandWalletWalletApiSourceDefinition
