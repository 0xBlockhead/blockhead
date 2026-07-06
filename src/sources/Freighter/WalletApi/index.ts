// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const freighterWalletApiSourceDefinition = {
	provider: SourceProvider.Freighter,
	source: Source.Freighter_WalletApi,
	label: 'Freighter wallet API',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default freighterWalletApiSourceDefinition
