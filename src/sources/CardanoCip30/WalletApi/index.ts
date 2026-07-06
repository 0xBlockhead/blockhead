// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const cardanoCip30WalletApiSourceDefinition = {
	provider: SourceProvider.CardanoCip30,
	source: Source.CardanoCip30_WalletApi,
	label: 'Cardano CIP-30 wallet API',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default cardanoCip30WalletApiSourceDefinition
