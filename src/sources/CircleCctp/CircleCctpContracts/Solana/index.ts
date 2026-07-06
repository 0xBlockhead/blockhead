// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const circleCctpContractsSolanaSourceDefinition = {
	provider: SourceProvider.CircleCctp,
	source: Source.CircleCctpContracts_Solana,
	label: 'Circle CCTP Solana contracts',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default circleCctpContractsSolanaSourceDefinition
