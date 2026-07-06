// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const easContractsEvmSourceDefinition = {
	provider: SourceProvider.Eas,
	source: Source.EasContracts_Evm,
	label: 'EAS contract catalog',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default easContractsEvmSourceDefinition
