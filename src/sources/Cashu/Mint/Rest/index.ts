// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const cashuMintRestSourceDefinition = {
	provider: SourceProvider.Cashu,
	source: Source.CashuMint_Rest,
	label: 'Cashu mint REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default cashuMintRestSourceDefinition
