// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const hederaWalletConnectSignClientSourceDefinition = {
	provider: SourceProvider.HederaWalletConnect,
	source: Source.HederaWalletConnect_SignClient,
	label: 'Hedera WalletConnect sign client',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default hederaWalletConnectSignClientSourceDefinition
