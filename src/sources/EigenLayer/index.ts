// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const eigenLayerContractsEvmSourceDefinition = {
	provider: SourceProvider.EigenLayer,
	source: Source.EigenLayerContracts_Evm,
	label: 'EigenLayer contract catalog',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default eigenLayerContractsEvmSourceDefinition
