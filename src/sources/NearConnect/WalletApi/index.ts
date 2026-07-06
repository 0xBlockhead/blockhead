// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const nearConnectWalletApiSourceDefinition = {
	provider: SourceProvider.NearConnect,
	source: Source.NearConnect_WalletApi,
	label: 'NEAR Connect wallet API',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default nearConnectWalletApiSourceDefinition
