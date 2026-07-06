// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const pythEvmContractSourceDefinition = {
	provider: SourceProvider.Pyth,
	source: Source.Pyth_EvmContract,
	label: 'Pyth EVM contract catalog',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default pythEvmContractSourceDefinition
