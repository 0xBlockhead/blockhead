// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const blockscoutRestSourceDefinition = {
	provider: SourceProvider.Blockscout,
	source: Source.Blockscout_Rest,
	label: 'Blockscout REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default blockscoutRestSourceDefinition
