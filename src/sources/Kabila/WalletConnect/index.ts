// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const kabilaWalletConnectSourceDefinition = {
	provider: SourceProvider.Kabila,
	source: Source.Kabila_WalletConnect,
	label: 'Kabila WalletConnect',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default kabilaWalletConnectSourceDefinition
