// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const tronLinkWalletApiSourceDefinition = {
	provider: SourceProvider.TronLink,
	source: Source.TronLink_WalletApi,
	label: 'TronLink wallet API',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default tronLinkWalletApiSourceDefinition
