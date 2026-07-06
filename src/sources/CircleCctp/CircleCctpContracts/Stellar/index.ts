// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const circleCctpContractsStellarSourceDefinition = {
	provider: SourceProvider.CircleCctp,
	source: Source.CircleCctpContracts_Stellar,
	label: 'Circle CCTP Stellar contracts',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default circleCctpContractsStellarSourceDefinition
