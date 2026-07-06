// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const hashConnectWalletApiSourceDefinition = {
	provider: SourceProvider.HashConnect,
	source: Source.HashConnect_WalletApi,
	label: 'HashConnect wallet API',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default hashConnectWalletApiSourceDefinition
