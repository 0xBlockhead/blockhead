// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const walletConnectSignClientSourceDefinition = {
	provider: SourceProvider.WalletConnect,
	source: Source.WalletConnect_SignClient,
	label: 'WalletConnect sign client',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default walletConnectSignClientSourceDefinition
