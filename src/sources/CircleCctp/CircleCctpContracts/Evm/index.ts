// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const circleCctpContractsEvmSourceDefinition = {
	provider: SourceProvider.CircleCctp,
	source: Source.CircleCctpContracts_Evm,
	label: 'Circle CCTP EVM contracts',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default circleCctpContractsEvmSourceDefinition
