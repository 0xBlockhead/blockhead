// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const stellarTomlRestSourceDefinition = {
	provider: SourceProvider.StellarToml,
	source: Source.StellarToml_Rest,
	label: 'Stellar TOML REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default stellarTomlRestSourceDefinition
