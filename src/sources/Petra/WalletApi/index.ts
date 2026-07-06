// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const petraWalletApiSourceDefinition = {
	provider: SourceProvider.Petra,
	source: Source.Petra_WalletApi,
	label: 'Petra wallet API',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default petraWalletApiSourceDefinition
