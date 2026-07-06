// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const internetComputerWalletApiSourceDefinition = {
	provider: SourceProvider.InternetComputer,
	source: Source.InternetComputer_WalletApi,
	label: 'Internet Computer wallet API',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default internetComputerWalletApiSourceDefinition
