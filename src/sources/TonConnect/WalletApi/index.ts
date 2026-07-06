// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const tonConnectWalletApiSourceDefinition = {
	provider: SourceProvider.TonConnect,
	source: Source.TonConnect_WalletApi,
	label: 'TonConnect wallet API',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default tonConnectWalletApiSourceDefinition
